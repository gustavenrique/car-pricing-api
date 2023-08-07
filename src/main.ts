import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestInterceptor } from './controllers/interceptors/request.interceptor';
const cookienSession = require('cookie-session');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        cookienSession({
            keys: ['42$#$djwj@r3rSSAe23q'],
        })
    );

    // swagger
    SwaggerModule.setup(
        'docs', // endpoint
        app,
        SwaggerModule.createDocument(
            app,
            new DocumentBuilder().setTitle('Car Pricing API').setDescription('A RESTful API for Car Pricing').setVersion('1.0').build()
        )
    );

    // pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    );

    app.useGlobalInterceptors(new RequestInterceptor());

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
