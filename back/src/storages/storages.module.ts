import { Module } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { StoragesController } from './storages.controller';
import { Storage } from './entities/storage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [StoragesController],
  providers: [StoragesService],
})
export class StoragesModule {}
