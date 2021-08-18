import { OrderStatus } from './enums/order-status';
import { GreenBag } from './green-bag.dto';

export class Order {
  constructor(clientId: string, providerId: string, status: OrderStatus, bags: Array<GreenBag>, totalPrice: number) {
    this.clientId = clientId;
    this.providerId = providerId;
    this.status = status;
    this.bags = bags;
    this.totalPrice = totalPrice;
  }

  id: string;
  clientId: string;
  providerId: string;
  status: OrderStatus;
  bags: Array<GreenBag>;
  totalPrice: number;
}
