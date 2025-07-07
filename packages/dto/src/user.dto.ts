import { IBaseCreatedUpdated } from './base/base-created-updated.model';

export interface IUser extends IBaseCreatedUpdated {
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  googleId?: string;
  passwordHash?: string;
}
