import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity'; // Adjust the path as per your project structure

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async findByUserId(userId: string): Promise<Cart | undefined> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  async createByUserId(userId: string): Promise<Cart> {
    const newCart = this.cartRepository.create({ userId });
    return this.cartRepository.save(newCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let userCart = await this.findByUserId(userId);
    if (!userCart) {
      userCart = await this.createByUserId(userId);
    }
    return userCart;
  }

  async updateByUserId(userId: string, cartData: Partial<Cart>): Promise<Cart> {
    let userCart = await this.findOrCreateByUserId(userId);
    userCart = this.cartRepository.merge(userCart, cartData);
    return this.cartRepository.save(userCart);
  }

  async removeByUserId(userId: string): Promise<void> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      await this.cartRepository.remove(userCart);
    }
  }
}
