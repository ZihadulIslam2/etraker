import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async createTracking(recipientEmail: string, subject: string) {
    const record = await this.prisma.emailTracking.create({
      data: {
        recipientEmail,
        subject: subject ?? '',
        status: 'sent',
      },
    });

    return {
      ...record,
      trackingUrl: `/api/track/open/${record.id}`,
    };
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { recipientEmail: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.emailTracking.findMany({
        where,
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.emailTracking.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const record = await this.prisma.emailTracking.findUnique({
      where: { id },
      include: {
        opens: {
          orderBy: { detectedAt: 'desc' },
          take: 50,
        },
      },
    });
    return record;
  }

  async recordOpen(
    trackingId: string,
    ip: string | null,
    userAgent: string | null,
    referer: string | null,
  ) {
    const record = await this.prisma.emailTracking.findUnique({
      where: { id: trackingId },
    });

    if (!record) return;

    await this.prisma.$transaction([
      this.prisma.openEvent.create({
        data: {
          trackingId,
          ip,
          userAgent,
          referer,
        },
      }),
      this.prisma.emailTracking.update({
        where: { id: trackingId },
        data: {
          openCount: { increment: 1 },
          openedAt: new Date(),
          lastIp: ip,
          lastUserAgent: userAgent,
          status: 'opened',
        },
      }),
    ]);
  }

  async getStats() {
    const [totalSent, totalOpened, totalOpenEvents] = await Promise.all([
      this.prisma.emailTracking.count(),
      this.prisma.emailTracking.count({ where: { status: 'opened' } }),
      this.prisma.openEvent.count(),
    ]);

    const avgResult = await this.prisma.emailTracking.aggregate({
      _avg: { openCount: true },
      where: { openCount: { gt: 0 } },
    });

    return {
      totalSent,
      totalOpened,
      openRate:
        totalSent > 0
          ? Number(((totalOpened / totalSent) * 100).toFixed(1))
          : 0,
      totalOpenEvents,
      avgOpensPerEmail: avgResult._avg.openCount
        ? Number(avgResult._avg.openCount.toFixed(2))
        : 0,
    };
  }

  async getRecentActivity(limit = 10) {
    return this.prisma.openEvent.findMany({
      orderBy: { detectedAt: 'desc' },
      take: limit,
      include: {
        tracking: {
          select: {
            recipientEmail: true,
            subject: true,
          },
        },
      },
    });
  }
}
