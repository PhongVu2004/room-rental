import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  providers: [BookingsService, PrismaService, NotificationsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
