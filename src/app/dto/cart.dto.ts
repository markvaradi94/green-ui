import { GreenBag } from './green-bag.dto';

export class Cart {
  providerId: string;
  bags: Array<GreenBag>;
  totalPrice: number;
}
