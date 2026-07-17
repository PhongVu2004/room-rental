import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: { landlord: true }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== 'AVAILABLE') {
      throw new BadRequestException('Room is not available for booking');
    }

    if (room.landlordId === userId) {
      throw new BadRequestException('You cannot book your own room');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        roomId: dto.roomId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalPrice: dto.totalPrice,
        status: BookingStatus.PENDING,
      },
    });

    // Notify landlord
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.notificationsService.createNotification(
      room.landlordId,
      'Yêu cầu đặt phòng mới',
      `${user.name} vừa gửi yêu cầu đặt phòng "${room.title}".`
    );

    return booking;
  }

  async getGuestBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          select: { id: true, title: true, images: true, address: true, city: true, district: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getLandlordBookings(landlordId: string) {
    return this.prisma.booking.findMany({
      where: {
        room: { landlordId }
      },
      include: {
        room: {
          select: { id: true, title: true }
        },
        user: {
          select: { id: true, name: true, phone: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBookingDetail(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        user: { select: { id: true, name: true, phone: true, email: true } }
      }
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (role === 'GUEST' && booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    if (role === 'LANDLORD' && booking.room.landlordId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async approveBooking(id: string, landlordId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.room.landlordId !== landlordId) throw new ForbiddenException('Access denied');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException(`Cannot approve booking in ${booking.status} status`);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED }
    });

    // Optionally update room status to RENTED
    await this.prisma.room.update({
      where: { id: booking.roomId },
      data: { status: 'RENTED' }
    });

    // Notify guest
    await this.notificationsService.createNotification(
      booking.userId,
      'Yêu cầu đặt phòng được chấp nhận',
      `Yêu cầu đặt phòng "${booking.room.title}" của bạn đã được chủ trọ chấp nhận.`
    );

    return updated;
  }

  async rejectBooking(id: string, landlordId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.room.landlordId !== landlordId) throw new ForbiddenException('Access denied');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException(`Cannot reject booking in ${booking.status} status`);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.REJECTED }
    });

    // Notify guest
    await this.notificationsService.createNotification(
      booking.userId,
      'Yêu cầu đặt phòng bị từ chối',
      `Yêu cầu đặt phòng "${booking.room.title}" của bạn đã bị từ chối.`
    );

    return updated;
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Access denied');
    if (booking.status !== BookingStatus.PENDING) throw new BadRequestException(`Cannot cancel booking in ${booking.status} status`);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED }
    });

    // Notify landlord
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.notificationsService.createNotification(
      booking.room.landlordId,
      'Khách hàng hủy đặt phòng',
      `${user.name} đã hủy yêu cầu đặt phòng "${booking.room.title}".`
    );

    return updated;
  }
}
