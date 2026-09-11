export interface EmailTracking {
  id: string;
  recipientEmail: string;
  subject: string;
  trackingUrl: string | null;
  sentAt: string;
  openedAt: string | null;
  openCount: number;
  status: 'sent' | 'opened';
  lastIp: string | null;
  lastUserAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OpenEvent {
  id: string;
  trackingId: string;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  detectedAt: string;
  tracking: {
    recipientEmail: string;
    subject: string;
  };
}

export interface DashboardStats {
  totalSent: number;
  totalOpened: number;
  openRate: number;
  totalOpenEvents: number;
  avgOpensPerEmail: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
