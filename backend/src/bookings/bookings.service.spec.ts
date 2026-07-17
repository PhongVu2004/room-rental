import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;
  let notif: NotificationsService;

  const mockPrisma = {
    room: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    }
  };

  const mockNotif = {
    createNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotif },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
    notif = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('approveBooking', () => {
    it('should throw NotFoundException if booking not found', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.approveBooking('1', 'landlord-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if landlord is not owner', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({ id: '1', room: { landlordId: 'other-landlord' } });
      await expect(service.approveBooking('1', 'landlord-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if booking is not PENDING', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({ id: '1', status: 'CONFIRMED', room: { landlordId: 'landlord-1' } });
      await expect(service.approveBooking('1', 'landlord-1')).rejects.toThrow(BadRequestException);
    });

    it('should approve booking successfully', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({ id: '1', status: 'PENDING', userId: 'guest-1', roomId: 'room-1', room: { landlordId: 'landlord-1', title: 'Test' } });
      mockPrisma.booking.update.mockResolvedValue({ id: '1', status: 'CONFIRMED' });
      mockPrisma.room.update.mockResolvedValue({});

      const result = await service.approveBooking('1', 'landlord-1');

      expect(result.status).toBe('CONFIRMED');
      expect(mockPrisma.booking.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { status: 'CONFIRMED' } });
      expect(mockNotif.createNotification).toHaveBeenCalled();
    });
  });
});
