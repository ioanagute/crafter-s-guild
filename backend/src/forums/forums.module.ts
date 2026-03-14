import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  providers: [ForumsService, RolesGuard],
  controllers: [ForumsController]
})
export class ForumsModule {}
