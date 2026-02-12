export type CreateSecurityEvent = {
  userId: string;
  type: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metaData?: Record<string, string | number> | null;
};
