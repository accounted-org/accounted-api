import { User } from '../../../@types';

export interface IEmailService {
  sendForgotPasswordEmail(user: User, resetLink: string): Promise<boolean>;
}
