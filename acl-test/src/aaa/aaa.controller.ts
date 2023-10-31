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
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from 'src/user/permission.guard';
import { Permission } from 'src/permission.decorator';

@Controller('aaa')
@UseGuards(LoginGuard)
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}

  @Post()
  @Permission('create_aaa')
  @UseGuards(PermissionGuard)
  create(@Body() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @Get()
  @Permission('query_aaa')
  @UseGuards(PermissionGuard)
  findAll() {
    return this.aaaService.findAll();
  }

  @Get(':id')
  @Permission('query_aaa')
  @UseGuards(PermissionGuard)
  findOne(@Param('id') id: string) {
    return this.aaaService.findOne(+id);
  }

  @Patch(':id')
  @Permission('update_aaa')
  @UseGuards(PermissionGuard)
  update(@Param('id') id: string, @Body() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(+id, updateAaaDto);
  }

  @Delete(':id')
  @Permission('remove_aaa')
  @UseGuards(PermissionGuard)
  remove(@Param('id') id: string) {
    return this.aaaService.remove(+id);
  }
}
