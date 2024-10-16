// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors(); // Enable CORS
//   await app.listen(8082);
// }
// bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';

// const server = express();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
//   app.enableCors();
//   await app.init();
// }

// bootstrap();

// export default server;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(retries = 5) {
  let attempts = 0;

  while (attempts < retries) {
    try {
      const app = await NestFactory.create(AppModule);
      app.enableCors(); // Enable CORS
      const port = process.env.PORT || 8082;
      await app.listen(port); // Listen on the desired port
      console.log('Nest application successfully started on port 8082');
      return; // Exit the loop if successful
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed. Error: ${error.message}`);
      if (attempts < retries) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      } else {
        console.error('Max retries reached. Exiting application.');
        process.exit(1); // Exit the process if all retries fail
      }
    }
  }
}

bootstrap();

// Export the Nest application for Vercel
export default bootstrap;