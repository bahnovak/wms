import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';
import { CreateStockHistoryDto } from './dto/create-stock-history.dto';
import { UpdateStockHistoryDto } from './dto/update-stock-history.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('stock-history')
export class StockHistoryController {
  constructor(private readonly stockHistoryService: StockHistoryService) {}

  @Post()
  create(@Body() createStockHistoryDto: CreateStockHistoryDto) {
    return this.stockHistoryService.create(createStockHistoryDto);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.stockHistoryService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockHistoryDto: UpdateStockHistoryDto) {
    return this.stockHistoryService.update(+id, updateStockHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockHistoryService.remove(+id);
  }
}
