import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus, Role } from '@prisma/client';

describe('RoomsService', () => {
  let service: RoomsService;
  let prisma: PrismaService;

  const mockPrisma = {
    room: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    favoriteRoom: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const dto: CreateRoomDto = {
        title: 'Test Room',
        description: 'Test Desc',
        price: 1000,
        address: '123 Test St',
        city: 'Test City',
        district: 'Test Dist',
        amenities: '["WiFi"]',
        nearbyUniversities: '["Uni A"]',
        status: RoomStatus.AVAILABLE,
      };

      const mockCreatedRoom = {
        id: 'room-1',
        ...dto,
        amenities: ["WiFi"],
        nearbyUniversities: ["Uni A"],
        images: ['/uploads/test.jpg'],
        landlordId: 'user-1',
      };

      mockPrisma.room.create.mockResolvedValue(mockCreatedRoom);

      const result = await service.create('user-1', dto, ['/uploads/test.jpg']);

      expect(prisma.room.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Test Room',
          price: 1000,
          landlordId: 'user-1',
          images: ['/uploads/test.jpg'],
        }),
      });
      expect(result).toEqual(mockCreatedRoom);
    });
  });

  describe('findAll', () => {
    it('should return paginated rooms', async () => {
      mockPrisma.room.count.mockResolvedValue(1);
      mockPrisma.room.findMany.mockResolvedValue([
        { id: 'room-1', title: 'Test Room', favoritedBy: [] },
      ]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.meta.total).toBe(1);
      expect(result.data[0].id).toBe('room-1');
      expect(result.data[0].isFavorite).toBe(false);
      expect(prisma.room.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a room if found', async () => {
      mockPrisma.room.findUnique.mockResolvedValue({
        id: 'room-1',
        title: 'Test',
        favoritedBy: [{ id: 'fav-1' }],
      });

      const result = await service.findOne('room-1', 'user-1');
      expect(result.id).toBe('room-1');
      expect(result.isFavorite).toBe(true);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);
      await expect(service.findOne('room-invalid')).rejects.toThrow('Room with ID room-invalid not found');
    });
  });
});
