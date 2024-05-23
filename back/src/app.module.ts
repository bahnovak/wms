import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { OrdersModule } from './orders/orders.module';
import { StoragesModule } from './storages/storages.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { OrderPositionsModule } from './order_positions/order_positions.module';
import { PurchasePositionsModule } from './purchase_positions/purchase_positions.module';
import { StorageProductsModule } from './storage_products/storage_products.module';
import { StockHistoryModule } from './stock-history/stock-history.module';
import appConfig from './config/app.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    UsersModule,
    OrdersModule,
    StoragesModule,
    ProductsModule,
    SuppliersModule,
    PurchasesModule,
    OrderPositionsModule,
    PurchasePositionsModule,
    StorageProductsModule,
    IamModule,
    StockHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
