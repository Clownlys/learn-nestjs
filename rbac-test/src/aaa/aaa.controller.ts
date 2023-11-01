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
import { RequireLogin, RequirePermission } from 'src/custom.decorator';

@Controller('aaa')
@RequireLogin()
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}

  @Post()
  @RequirePermission('新增 aaa')
  create(@Body() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @Get()
  @RequirePermission('查询 aaa')
  findAll() {
    return this.aaaService.findAll();
  }

  @Get(':id')
  @RequirePermission('查询 aaa')
  findOne(@Param('id') id: string) {
    return this.aaaService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermission('修改 aaa')
  update(@Param('id') id: string, @Body() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(+id, updateAaaDto);
  }

  @Delete(':id')
  @RequirePermission('删除 aaa')
  remove(@Param('id') id: string) {
    return this.aaaService.remove(+id);
  }
}
