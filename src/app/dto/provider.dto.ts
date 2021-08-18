import { Inventory } from './inventory.dto';
import { Address } from './address.dto';
import { Dashboard } from './dashboard.dto';

export class Provider {
  id: string;
  accountId: string;
  name: string;
  description: string;
  since: Date;
  inventory: Inventory;
  address: Address;
  dashboard: Dashboard;
}
