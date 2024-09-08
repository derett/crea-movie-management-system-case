import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { WatchMovieDto } from './dto/watch-movie.dto';
import { FastifyRequest } from 'fastify';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { RolesDec } from 'src/shared/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('watch-history')
@Controller('watch-history')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @RolesDec(UserRoles.Customer)
  @Get('history')
  watchHistory(@Req() req: FastifyRequest) {
    return this.watchHistoryService.getWatchHistory(req.user);
  }

  @RolesDec(UserRoles.Customer)
  @HttpCode(HttpStatus.OK)
  @Post('watch')
  watchMovie(@Body() dto: WatchMovieDto, @Req() req: FastifyRequest) {
    return this.watchHistoryService.watchMovie(dto, req.user);
  }
}
