import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RolesDec } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { MoviesService } from './movies.service';
import { Public } from 'src/shared/decorators/public.decorator';

@UseGuards(RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id, true);
  }

  @RolesDec(UserRoles.Manager)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @RolesDec(UserRoles.Manager)
  @Patch()
  update(@Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(updateMovieDto);
  }

  @RolesDec(UserRoles.Manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}
