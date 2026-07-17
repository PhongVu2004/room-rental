import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Get global platform statistics for admin' })
  getStatistics() {
    return this.adminService.getStatistics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users for admin' })
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get all rooms for admin' })
  getRooms() {
    return this.adminService.getRooms();
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings for admin' })
  getBookings() {
    return this.adminService.getBookings();
  }
}
