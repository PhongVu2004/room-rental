import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.GUEST)
  @ApiOperation({ summary: 'Create a new booking request (GUEST)' })
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get booking history for current user' })
  findAll(@Request() req) {
    if (req.user.role === Role.LANDLORD) {
      return this.bookingsService.getLandlordBookings(req.user.id);
    }
    return this.bookingsService.getGuestBookings(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.getBookingDetail(id, req.user.id, req.user.role);
  }

  @Patch(':id/approve')
  @Roles(Role.LANDLORD)
  @ApiOperation({ summary: 'Approve a booking (LANDLORD)' })
  approve(@Param('id') id: string, @Request() req) {
    return this.bookingsService.approveBooking(id, req.user.id);
  }

  @Patch(':id/reject')
  @Roles(Role.LANDLORD)
  @ApiOperation({ summary: 'Reject a booking (LANDLORD)' })
  reject(@Param('id') id: string, @Request() req) {
    return this.bookingsService.rejectBooking(id, req.user.id);
  }

  @Patch(':id/cancel')
  @Roles(Role.GUEST)
  @ApiOperation({ summary: 'Cancel a pending booking (GUEST)' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }
}
