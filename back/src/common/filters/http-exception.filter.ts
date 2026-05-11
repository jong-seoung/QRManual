import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let code = "INTERNAL_ERROR";
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const r = res as { message?: string | string[]; error?: string };
        message = Array.isArray(r.message) ? r.message.join(", ") : (r.message ?? message);
        code = r.error ?? exception.constructor.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = exception.constructor.name;
    }

    if (status >= 500) {
      this.logger.error(`[${status}] ${code}: ${message}`, (exception as Error)?.stack);
    }

    response.status(status).json({ error: { code, message } });
  }
}
