import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Article } from './interfaces/article.interface';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private readonly articleModel: Model<Article>) {}

  test(): string {
    return 'article route testing';
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

  async updateSummary(id: string, updateData: { summary: string }): Promise<Article> {
    const article = await this.articleModel.findById(id);
    if (!article) {
        throw new NotFoundException('Article not found');
    }
    article.summary = updateData.summary; // Update the summary field
    return article.save(); // Save the updated article
  }

  async getDistinctSeMethods(): Promise<string[]> {
    try {
      const seMethods = await this.articleModel.distinct('seMethod', { seMethod: { $ne: "" } }).exec();
      console.log('Fetched SE Methods:', seMethods);
      return seMethods;
    } catch (error) {
      console.error('Error fetching distinct SE Methods:', error); // Error logging
      throw new Error('Error fetching SE Methods: ' + error.message);
    }
  }

  async searchArticles(method: string, startYear: number, endYear: number): Promise<Article[]> {
    try {
      const query: any = {
        seMethod: method,
      };

      if (startYear) {
        query.pubYear = { ...query.pubYear, $gte: startYear };
      }

      if (endYear) {
        query.pubYear = { ...query.pubYear, $lte: endYear };
      }

      console.log('Search query:', query); // Add logging to verify the query
      return await this.articleModel.find(query).exec();
    } catch (error) {
      console.error('Error searching articles:', error); // Add error logging
      throw new Error('Internal server error');
    }
  }

  async updateRating(id: string, rating: number): Promise<Article> {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    article.totalRating += rating;
    article.numberOfRatings += 1;
    article.averageRating = article.totalRating / article.numberOfRatings;

    return article.save();
  }
}