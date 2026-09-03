import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch('profile')
  updateOwnProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    // Ensure user can only update their own profile
    const userId = req.user.userId;
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete('profile')
  deleteOwnAccount(@Req() req: any) {
    const userId = req.user.userId;
    return this.usersService.remove(userId);
  }
}
