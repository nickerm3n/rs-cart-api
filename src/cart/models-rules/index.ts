import { Cart } from '../entities/cart.entity';

export function calculateCartTotal(cart: Cart): number {
  return cart
    ? cart?.items?.reduce((acc: number, cartItem) => {
        return acc + cartItem.product.price * cartItem.count;
      }, 0)
    : 0;
}
