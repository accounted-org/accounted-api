export type SecurityEventMetaData = {
  via?: string;
  requestId: string;
  newEmail?: string;
};

export type SecurityEvent = {
  id: string;
  userId: string;
  type: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: SecurityEventMetaData | null;
  createdAt: Date;
};
