import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product]), OrderModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
