import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import swaggerCss from '../public/swagger.css';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // swagger
    const swaggerDocument = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle('Car Pricing API')
            .setDescription('A RESTful API for Car Pricing')
            .setVersion('1.0')
            .build()
    );

    SwaggerModule.setup('docs', app, swaggerDocument, {
        customSiteTitle: 'Car Pricing API',
        customCss: swaggerCss,
    });

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
