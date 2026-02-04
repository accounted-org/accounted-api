import {
  SignInStepOneRequestDto,
  SignInStepTwoRequestDto,
  RefreshResponseDto,
  SignInStepOneResponseDto,
  SignInStepTwoResponseDto,
} from '../dtos';

export interface IAuthService {
  signInStepOne(
    dto: SignInStepOneRequestDto,
  ): Promise<SignInStepOneResponseDto>;
  signInStepTwo(
    dto: SignInStepTwoRequestDto,
  ): Promise<SignInStepTwoResponseDto>;
  refresh(userId: string, tokenVersion: number): Promise<RefreshResponseDto>;
  invalidateRefreshToken(userId: string): Promise<void>;
  googleLogin(googleUser: unknown): Promise<{ accessToken: string }>;
}
