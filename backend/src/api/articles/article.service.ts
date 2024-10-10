import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Article } from './interfaces/article.interface';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private readonly articleModel: Model<Article>) {}

  test(): string {
    return 'book route testing';
  }

  async findAll(): Promise<Article[]> {
      return await this.articleModel.find().exec();
  }

  // Fetch articles by status
  async findByStatus(status: string): Promise<Article[]> {
    return this.articleModel.find({ status }).exec(); // Filters articles by the given status
  }

  async findOne(id: string): Promise<Article> {
      return await this.articleModel.findById(id).exec();
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return await this.articleModel.create(createArticleDto);
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return await this.articleModel.findByIdAndUpdate(id, createArticleDto).exec();
  }

  async delete(id: string) {
      const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
      return deletedArticle;
  }
}