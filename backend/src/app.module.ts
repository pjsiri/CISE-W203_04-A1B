import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleSchema } from './api/articles/schemas/article.schema';
import { ArticleController } from './api/articles/article.controller';
import { ArticleService } from './api/articles/article.service';
import { EmailSchema } from './api/emails/email.schema';
import { EmailController } from './api/emails/email.controller';
import { EmailService } from './api/emails/email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }, { name: 'Email', schema: EmailSchema }]),
  ],
  controllers: [AppController, ArticleController, EmailController],
  providers: [AppService, ArticleService, EmailService],
})
export class AppModule {}