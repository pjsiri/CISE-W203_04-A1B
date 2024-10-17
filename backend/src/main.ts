// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
// import * as mongoose from 'mongoose';
// import * as dotenv from 'dotenv';

// dotenv.config();

// async function bootstrap() {
//   const dbUrl = process.env.DB_URL;
  
//   Logger.log(`DB_URI: ${dbUrl}`, 'Bootstrap');

//   try {
//     await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
//     Logger.log('Database connected successfully');
//   } catch (err) {
//     Logger.error('Database connection error:', err.message);
//   }

//   const app = await NestFactory.create(AppModule);

//   app.enableCors({ origin: true, credentials: true });
//   const port = process.env.PORT || 8082;
  
//   await app.listen(port, () => Logger.log(`Server running on port ${port}`));
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { Logger } from '@nestjs/common';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();

  if (process.env.NODE_ENV === 'production') {
    await app.init(); // Vercel handles the listening in production
  } else {
    const port = process.env.PORT || 8082;
    await app.listen(port, () => Logger.log(`Server running on port ${port}`));
  }
}
bootstrap();

export default server;