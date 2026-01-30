import { SignInRequestDto } from '../dtos/request';
import { RefreshResponseDto, SignInResponseDto } from '../dtos/response';

export interface IAuthService {
  signIn(dto: SignInRequestDto): Promise<SignInResponseDto>;
  refresh(userId: string, tokenVersion: number): Promise<RefreshResponseDto>;
  invalidateRefreshToken(userId: string): Promise<void>;
}
