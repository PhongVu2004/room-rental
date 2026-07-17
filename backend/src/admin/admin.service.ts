import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const totalUsers = await this.prisma.user.count();
    const totalLandlords = await this.prisma.user.count({ where: { role: 'LANDLORD' } });
    const totalRooms = await this.prisma.room.count();
    const totalBookings = await this.prisma.booking.count();

    const result = await this.prisma.booking.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: 'CONFIRMED',
      }
    });
    
    const totalRevenue = result._sum.totalPrice || 0;

    const availableRooms = await this.prisma.room.count({ where: { status: 'AVAILABLE' } });
    const rentedRooms = await this.prisma.room.count({ where: { status: 'RENTED' } });
    const maintenanceRooms = await this.prisma.room.count({ where: { status: 'MAINTENANCE' } });

    // Users signed up in the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentUsers = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true }
    });

    const userGrowth = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('en-US', { month: 'short' });
      const count = recentUsers.filter(u => u.createdAt.getMonth() === d.getMonth() && u.createdAt.getFullYear() === d.getFullYear()).length;
      return { month, count };
    }).reverse();

    return {
      totalUsers,
      totalLandlords,
      totalRooms,
      totalBookings,
      totalRevenue,
      userGrowth,
      roomStatus: [
        { name: 'Available', value: availableRooms, color: '#22c55e' },
        { name: 'Rented', value: rentedRooms, color: '#3b82f6' },
        { name: 'Maintenance', value: maintenanceRooms, color: '#f59e0b' },
      ]
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        isEmailVerified: true,
        _count: {
          select: { rooms: true, bookings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRooms() {
    return this.prisma.room.findMany({
      include: {
        landlord: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBookings() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: { select: { id: true, title: true, landlordId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
