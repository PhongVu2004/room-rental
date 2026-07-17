import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';
import { Prisma, RoomStatus, Role } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(landlordId: string, createRoomDto: CreateRoomDto, imagePaths: string[]) {
    return this.prisma.room.create({
      data: {
        title: createRoomDto.title,
        description: createRoomDto.description,
        price: createRoomDto.price,
        address: createRoomDto.address,
        city: createRoomDto.city,
        district: createRoomDto.district,
        amenities: createRoomDto.amenities ? JSON.parse(createRoomDto.amenities) : [],
        nearbyUniversities: createRoomDto.nearbyUniversities ? JSON.parse(createRoomDto.nearbyUniversities) : [],
        images: imagePaths,
        status: createRoomDto.status || RoomStatus.AVAILABLE,
        landlordId,
      },
    });
  }

  async findAll(filter: FilterRoomDto, userId?: string) {
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.RoomWhereInput = {};

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { address: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) where.price.gte = filter.minPrice;
      if (filter.maxPrice !== undefined) where.price.lte = filter.maxPrice;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.landlordId) {
      where.landlordId = filter.landlordId;
    }

    // JSON array searching in Prisma Postgres uses jsonb functions or we can do array contains
    // For simplicity with Json type, if we use Jsonb we could use array_contains. 
    // Since we used Json, we might have to filter in memory or use raw queries if it gets complex.
    // However, Prisma supports basic Json filtering in Postgres.
    // We'll use a simplified approach: just fetch and let frontend filter, or use Prisma's array-contains if it was String[].
    // Given the current schema uses Json, searching inside JSON arrays without raw queries is limited.
    // To handle amenities and universities, we will fetch and filter in JS if they exist for now, 
    // or if we switch them to String[] in prisma it's easier. Since it's Json, let's just do a basic implementation.

    let orderBy: Prisma.RoomOrderByWithRelationInput = { createdAt: 'desc' };
    if (filter.sortBy) {
      orderBy = { [filter.sortBy]: filter.sortOrder || 'asc' };
    }

    const [total, rooms] = await Promise.all([
      this.prisma.room.count({ where }),
      this.prisma.room.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          landlord: {
            select: { id: true, name: true, phone: true, email: true },
          },
          favoritedBy: userId ? { where: { userId } } : false,
        },
      }),
    ]);

    // Map favoritedBy to a simple boolean isFavorite
    const mappedRooms = rooms.map(room => ({
      ...room,
      isFavorite: room.favoritedBy ? room.favoritedBy.length > 0 : false,
      favoritedBy: undefined, // remove from output
    }));

    return {
      data: mappedRooms,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        landlord: {
          select: { id: true, name: true, phone: true, email: true },
        },
        reviews: {
          include: { user: { select: { name: true } } },
        },
        favoritedBy: userId ? { where: { userId } } : false,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    const result = {
      ...room,
      isFavorite: room.favoritedBy ? room.favoritedBy.length > 0 : false,
      favoritedBy: undefined,
    };

    return result;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string, userRole: Role, newImages?: string[]) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    if (room.landlordId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own rooms');
    }

    const data: any = { ...updateRoomDto };
    if (updateRoomDto.amenities) data.amenities = JSON.parse(updateRoomDto.amenities);
    if (updateRoomDto.nearbyUniversities) data.nearbyUniversities = JSON.parse(updateRoomDto.nearbyUniversities);
    
    if (newImages && newImages.length > 0) {
      // Append new images to existing images
      const existingImages = room.images as string[] || [];
      data.images = [...existingImages, ...newImages];
    }

    const updated = await this.prisma.room.update({
      where: { id },
      data,
    });

    if (updateRoomDto.status && updateRoomDto.status !== room.status) {
      this.eventEmitter.emit('room.statusUpdated', {
        landlordId: room.landlordId,
        roomTitle: room.title,
        status: updateRoomDto.status
      });
    }

    return updated;
  }

  async removeImage(roomId: string, imageUrl: string, userId: string, userRole: Role) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    if (room.landlordId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own rooms');
    }

    const images = (room.images as string[]) || [];
    const newImages = images.filter(img => img !== imageUrl);

    return this.prisma.room.update({
      where: { id: roomId },
      data: { images: newImages },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    if (room.landlordId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own rooms');
    }

    return this.prisma.room.delete({
      where: { id },
    });
  }

  async toggleFavorite(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const favorite = await this.prisma.favoriteRoom.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (favorite) {
      await this.prisma.favoriteRoom.delete({
        where: { id: favorite.id },
      });
      return { isFavorite: false };
    } else {
      await this.prisma.favoriteRoom.create({
        data: {
          userId,
          roomId,
        },
      });

      this.eventEmitter.emit('room.favorited', {
        landlordId: room.landlordId,
        roomTitle: room.title
      });

      return { isFavorite: true };
    }
  }

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favoriteRoom.findMany({
      where: { userId },
      include: {
        room: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map(f => f.room);
  }

  async getStatistics(landlordId: string) {
    const totalRooms = await this.prisma.room.count({ where: { landlordId } });
    const rentedRooms = await this.prisma.room.count({ where: { landlordId, status: RoomStatus.RENTED } });
    const availableRooms = await this.prisma.room.count({ where: { landlordId, status: RoomStatus.AVAILABLE } });
    
    const rooms = await this.prisma.room.findMany({ where: { landlordId }, select: { price: true } });
    const avgPrice = rooms.length > 0 ? rooms.reduce((acc, r) => acc + r.price, 0) / rooms.length : 0;

    // Calculate revenue data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentBookings = await this.prisma.booking.findMany({
      where: {
        room: { landlordId },
        status: 'CONFIRMED',
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true, totalPrice: true }
    });

    const revenueData = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('en-US', { month: 'short' });
      const revenue = recentBookings
        .filter(b => b.createdAt.getMonth() === d.getMonth() && b.createdAt.getFullYear() === d.getFullYear())
        .reduce((sum, b) => sum + b.totalPrice, 0);
      return { month, revenue };
    }).reverse();

    return {
      totalRooms,
      rentedRooms,
      availableRooms,
      avgPrice,
      revenueData,
      roomStatus: [
        { name: 'Available', value: availableRooms, color: '#22c55e' },
        { name: 'Rented', value: rentedRooms, color: '#3b82f6' },
      ]
    };
  }
}
