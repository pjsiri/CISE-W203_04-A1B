import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticleService {
    private readonly articleModel;
    constructor(articleModel: Model<Article>);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
}
