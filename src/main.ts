import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
