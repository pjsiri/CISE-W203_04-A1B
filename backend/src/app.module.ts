import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleSchema } from './api/schemas/article.schema';
import { ArticleController } from './api/articles/article.controller';
import { ArticleService } from './api/articles/article.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot("mongodb+srv://bsouthg8:w203_04@cluster0.9mk3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  controllers: [AppController, ArticleController],
  providers: [AppService, ArticleService],
})
export class AppModule {}