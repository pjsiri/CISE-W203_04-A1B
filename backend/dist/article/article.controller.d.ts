import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    create(createArticleDto: CreateArticleDto): Promise<import("./interfaces/article.interface").Article>;
}
