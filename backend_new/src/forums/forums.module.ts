import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';

@Module({
  providers: [ForumsService],
  controllers: [ForumsController]
})
export class ForumsModule {}
