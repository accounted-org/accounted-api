import { SetMetadata } from '@nestjs/common';

export const SKIP_MFA_SESSION_KEY = 'skipMfaSession';
export const SkipMfaSession = () => SetMetadata(SKIP_MFA_SESSION_KEY, true);
