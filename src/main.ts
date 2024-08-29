import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { version } from '../package.json';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const majVersion = version.split('.');
  app.setGlobalPrefix(`api/v${majVersion[0]}`);

  const usersService = app.get(UsersService);
  await usersService.init();

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
}
bootstrap();
