import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.env.DATABASE_URL = "file:C:\\Users\\Inna\\Desktop\\guid-forum-market-platform-1\\backend\\dev.db";

async function bootstrap() {
  dotenv.config(); // Force .env to load before anything else
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend integration
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
