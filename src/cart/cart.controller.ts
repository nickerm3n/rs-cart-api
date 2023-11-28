import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Post,
  HttpStatus,
} from '@nestjs/common';
// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { UserIdQuery } from './decorators/user-id.decorator';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @Get()
  async findUserCart(@UserIdQuery() userId: string) {
    const cart = await this.cartService.findOrCreateByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  @Put()
  async updateUserCart(@UserIdQuery() userId: string, @Body() body) {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(userId, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      },
    };
  }

  @Delete()
  async clearUserCart(@UserIdQuery() userId: string) {
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Post('checkout')
  async checkout(@UserIdQuery() userId: string, @Body() body) {
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order = await this.orderService.create({
      ...body,
      userId,
      cartId,
      items,
      total,
    });

    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}
