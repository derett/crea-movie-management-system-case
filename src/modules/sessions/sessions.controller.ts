import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { RolesDec } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Public()
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id, true);
  }

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Patch()
  update(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(updateSessionDto);
  }

  @ApiBearerAuth()
  @RolesDec(UserRoles.Manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.delete(id);
  }
}
