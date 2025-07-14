import { IUserUserRole } from './user-user-role.dto';

export interface IRegisterUserDto {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}

export interface IRegisterUserByGoogleDto {
  name: string;
  email: string;
  googleId: string;
}

export interface ILoginUserByGoogleDto {
  name: string;
  email: string;
  googleId: string;
}

export interface IGetMeResponse {
  id: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  refreshToken?: string;
  userUserRoles?: IUserUserRole[];
  rights: string[];
}
