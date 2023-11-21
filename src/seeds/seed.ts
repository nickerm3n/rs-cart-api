import { createConnection, getRepository } from 'typeorm';
import { Cart, CartStatus } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../cart/entities/product.entity';

import 'dotenv/config';

async function seed() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Cart, CartItem, Product],
    synchronize: true,
    dropSchema: true,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Seed products
  const productRepository = getRepository(Product);
  const products = [
    {
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      title: 'Example Product',
      description: 'Example Product Description',
      price: 100.0,
    },
  ];
  await productRepository.save(products);

  // Seed carts
  const cartRepository = getRepository(Cart);
  const carts = [
    {
      id: '3d3e980e-3b6c-4c02-9d3e-6c141289bea7',
      userId: '1c90e5f8-23d5-4229-9e43-0515d8d5c439',
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-02'),
      status: CartStatus.OPEN,
    },
  ];
  await cartRepository.save(carts);

  // Seed cart items
  const cartItemRepository = getRepository(CartItem);
  const cartItems = [
    {
      cart: carts[0],
      product: products[0],
      count: 4,
    },
  ];
  await cartItemRepository.save(cartItems);

  await connection.close();
}

seed()
  .then(() => console.log('Seeding complete!'))
  .catch(error => console.error('Seeding failed:', error));
