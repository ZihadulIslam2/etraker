import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  Req,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { TrackingService } from './tracking.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { QueryTrackingDto } from './dto/query-tracking.dto.js';

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

@Controller('api')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('track/open/:trackingId')
  async trackOpen(
    @Param('trackingId', new ParseUUIDPipe({ version: '4' })) trackingId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.ip ??
      req.socket.remoteAddress;

    this.trackingService
      .recordOpen(
        trackingId,
        clientIp ?? null,
        (req.headers['user-agent'] as string) ?? null,
        (req.headers['referer'] as string) ?? null,
      )
      .catch(() => {});

    res.set({
      'Content-Type': 'image/gif',
      'Content-Length': TRANSPARENT_GIF.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      Pragma: 'no-cache',
      Expires: '0',
    });
    res.status(200).end(TRANSPARENT_GIF);
  }

  @Post('tracking')
  @HttpCode(201)
  async create(@Body() dto: CreateTrackingDto) {
    return this.trackingService.createTracking(
      dto.recipientEmail,
      dto.subject ?? '',
    );
  }

  @Get('tracking')
  async findAll(@Query() query: QueryTrackingDto) {
    return this.trackingService.findAll(query);
  }

  @Get('tracking/:id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackingService.findOne(id);
  }

  @Get('dashboard/stats')
  async getStats() {
    return this.trackingService.getStats();
  }

  @Get('dashboard/recent-activity')
  async getRecentActivity(@Query('limit') limit?: string) {
    return this.trackingService.getRecentActivity(
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
