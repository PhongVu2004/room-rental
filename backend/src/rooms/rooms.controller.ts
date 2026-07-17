import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Query, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createRoomDto: CreateRoomDto, @Request() req, @UploadedFiles() files: Express.Multer.File[]) {
    const imagePaths = files ? files.map(f => `/uploads/${f.filename}`) : [];
    return this.roomsService.create(req.user.id, createRoomDto, imagePaths);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms with filter/search' })
  findAll(@Query() filter: FilterRoomDto, @Request() req) {
    // If user is logged in (via some custom logic or optional auth guard), we could pass user ID
    // We will just pass undefined if no user is present in req
    return this.roomsService.findAll(filter, req?.user?.id);
  }
  
  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get favorite rooms for current user' })
  getFavorites(@Request() req) {
    return this.roomsService.getFavorites(req.user.id);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get room statistics for landlord' })
  getStatistics(@Request() req) {
    return this.roomsService.getStatistics(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single room' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.roomsService.findOne(id, req?.user?.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a room' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('newImages', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id') id: string, 
    @Body() updateRoomDto: UpdateRoomDto, 
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const newImagePaths = files ? files.map(f => `/uploads/${f.filename}`) : [];
    return this.roomsService.update(id, updateRoomDto, req.user.id, req.user.role, newImagePaths);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a room' })
  remove(@Param('id') id: string, @Request() req) {
    return this.roomsService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle favorite status for a room' })
  toggleFavorite(@Param('id') id: string, @Request() req) {
    return this.roomsService.toggleFavorite(id, req.user.id);
  }
}
