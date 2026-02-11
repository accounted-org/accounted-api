import { SetMetadata } from '@nestjs/common';

export const REQUIRE_RECENT_MFA_KEY = 'requireRecentMfa';

export const RequireRecentMfa = (maxAgeSeconds = 300) =>
  SetMetadata(REQUIRE_RECENT_MFA_KEY, maxAgeSeconds);

export const MFA_5_MINUTES = 300;
