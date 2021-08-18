import { Address } from './address.dto';
import { Cart } from './cart.dto';

export class Client {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  address: Address;
  cart: Cart;
}
