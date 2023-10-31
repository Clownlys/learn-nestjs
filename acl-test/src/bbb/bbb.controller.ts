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
import { BbbService } from './bbb.service';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from 'src/user/permission.guard';
import { Permission } from 'src/permission.decorator';

@Controller('bbb')
@UseGuards(LoginGuard)
export class BbbController {
  constructor(private readonly bbbService: BbbService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @Permission('create_bbb')
  create(@Body() createBbbDto: CreateBbbDto) {
    return this.bbbService.create(createBbbDto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permission('query_bbb')
  findAll() {
    return this.bbbService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @Permission('query_bbb')
  findOne(@Param('id') id: string) {
    return this.bbbService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @Permission('update_bbb')
  update(@Param('id') id: string, @Body() updateBbbDto: UpdateBbbDto) {
    return this.bbbService.update(+id, updateBbbDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @Permission('remove_bbb')
  remove(@Param('id') id: string) {
    return this.bbbService.remove(+id);
  }
}
