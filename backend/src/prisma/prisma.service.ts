import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const maxRetries = 10;
    for (let i = 1; i <= maxRetries; i++) {
      try {
        await this.$connect();
        return;
      } catch (err) {
        if (i === maxRetries) throw err;
        console.log(`Waiting for database (attempt ${i}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
