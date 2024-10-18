import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('close', () => {
      const { statusCode, statusMessage } = response;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${statusMessage}`,
      );
    });

    next();
  }
}