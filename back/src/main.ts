import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug"],
  });
  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // nginx에서 같은 도메인으로 통합되면 CORS는 사실상 불필요. dev에서 호스트 직접 호출 시만 허용.
  app.enableCors({
    origin: config.get("FRONTEND_URL") ?? "http://localhost:3000",
    credentials: true,
  });

  const swagger = new DocumentBuilder()
    .setTitle("QRManual API")
    .setDescription("QRManual NestJS API")
    .setVersion("0.0.0")
    .addCookieAuth("access_token")
    .build();
  const doc = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("api/docs", app, doc, { useGlobalPrefix: false });

  const port = Number(config.get("PORT") ?? 8080);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
