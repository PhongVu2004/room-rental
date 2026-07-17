import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  // A global subject that will broadcast notification events
  public readonly notificationEvents = new Subject<Notification>();

  constructor(private prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Internal method to create and push
  async createNotification(userId: string, title: string, message: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    // Broadcast the event for SSE
    this.notificationEvents.next(notification);

    return notification;
  }

  // Listen to application events
  @OnEvent('booking.created')
  handleBookingCreated(payload: { landlordId: string; roomTitle: string }) {
    this.createNotification(
      payload.landlordId,
      'New Booking Request',
      `Someone requested to book your room: ${payload.roomTitle}`
    );
  }

  @OnEvent('booking.statusUpdated')
  handleBookingStatus(payload: { userId: string; roomTitle: string; status: string }) {
    this.createNotification(
      payload.userId,
      'Booking Status Updated',
      `Your booking for ${payload.roomTitle} is now ${payload.status}`
    );
  }

  @OnEvent('room.favorited')
  handleRoomFavorited(payload: { landlordId: string; roomTitle: string }) {
    this.createNotification(
      payload.landlordId,
      'Room Favorited',
      `Someone added your room to their favorites: ${payload.roomTitle}`
    );
  }

  @OnEvent('room.statusUpdated')
  handleRoomStatus(payload: { landlordId: string; roomTitle: string; status: string }) {
    this.createNotification(
      payload.landlordId,
      'Room Status Changed',
      `Your room ${payload.roomTitle} is now ${payload.status}`
    );
  }

  @OnEvent('user.registered')
  handleUserRegistered(payload: { userId: string; name: string }) {
    this.createNotification(
      payload.userId,
      'Welcome!',
      `Hello ${payload.name}, welcome to RoomRent platform!`
    );
  }
}
