import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 跨域
  app.enableCors({
    origin: 'http://localhost:5500',
    credentials: true,
  });
  app.useStaticAssets('public', { prefix: '/static/' });
  await app.listen(3000);
}
bootstrap();
