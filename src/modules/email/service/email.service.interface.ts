import { User } from '../../../@types';

export interface IEmailService {
  sendForgotPasswordEmail(user: User, resetLink: string): Promise<boolean>;
  sendChangeEmailRequestEmail(
    user: User,
    email: string,
    link: string,
    expiresIn: string,
  ): Promise<boolean>;
  sendNotifyEmailChanged(
    user: User,
    oldEmail: string,
    newEmail: string,
  ): Promise<boolean>;
  sendPasswordChangedEmail(user: User): Promise<boolean>;
}
