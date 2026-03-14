import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { UsersModule } from './users/users.module';
import { ForumsModule } from './forums/forums.module';
import { MarketModule } from './market/market.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, ForumsModule, MarketModule, EventsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule { }
