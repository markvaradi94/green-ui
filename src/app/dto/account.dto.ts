import { AccountType } from './enums/account-type';

export class Account {
  id: string;
  email: string;
  password: string;
  phoneNumber: string;
  type: AccountType;
}
