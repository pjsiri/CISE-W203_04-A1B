import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { error } from 'console';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Post()
  // async create(@Body() createArticleDto: CreateArticleDto) {
  //   return this.articleService.create(createArticleDto);
  // }

  @Get('/test')
  test() {
      return this.articleService.test();
  }

  // Get all articles or filter by status using query params
  @Get('/')
  async findAll(@Query('status') status?: string) {
      console.log('Status Query:', status); // Log the query parameter
  
      try {
          if (status) {
              // Log the filtered response
              console.log(`Fetching articles with status: ${status}`);
              return await this.articleService.findByStatus(status);
          } else {
              console.log('Fetching all articles');
              return await this.articleService.findAll();
          }
      } catch (error) {
          throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: 'No Articles found',
              },
              HttpStatus.NOT_FOUND,
              { cause: error },
          );
      }
  }

    // Get distinct SE Methods for the dropdown list
    @Get('distinct-se-methods')
    async getDistinctSeMethods() {
    try {
        return await this.articleService.getDistinctSeMethods();
    } catch (error) {
        console.error('Error in getDistinctSeMethods controller:', error); // error logging
        throw new HttpException(
        {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
        );
    }
    }

    // Search articles by SE method and year range
    @Get('search')
    async searchArticles(
        @Query('method') method: string,
        @Query('startYear') startYear: string,
        @Query('endYear') endYear: string,
    ) {
        try {
        const startYearNum = startYear ? parseInt(startYear, 10) : undefined;
        const endYearNum = endYear ? parseInt(endYear, 10) : undefined;
        return await this.articleService.searchArticles(method, startYearNum, endYearNum);
        } catch (error) {
        console.error('Error in searchArticles controller:', error); // Add error logging
        throw new HttpException(
            {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error },
        );
        }
    }

    @Put(':id/rate')
    async rateArticle(
      @Param('id') id: string,
      @Body('rating') rating: number,
    ) {
      try {
        return await this.articleService.updateRating(id, rating);
      } catch (error) {
        console.error('Error in rateArticle controller:', error);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal server error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }

  // Get one article via id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
      try {
          return this.articleService.findOne(id);
      } catch {
          throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: 'No Article found',
              },
              HttpStatus.NOT_FOUND,
              { cause: error },
          );
      }
  }

  // Create/add a article
  @Post('/')
  async addArticle(@Body() createArticleDto: CreateArticleDto) {
      try {
          await this.articleService.create(createArticleDto);
          return { message: 'Article added successfully' };
      } catch {
          throw new HttpException(
              {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Unable to add this article',
              },
              HttpStatus.BAD_REQUEST,
              { cause: error },
          );
      }
  }

  // Update a article
  @Put('/:id')
  async updateArticle(
      @Param('id') id: string,
      @Body() createArticleDto: CreateArticleDto,
  ) {
      try {
          await this.articleService.update(id, createArticleDto);
          return { message: 'Article updated successfully' };
      } catch {
          throw new HttpException(
              {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Unable to update this article',
              },
              HttpStatus.BAD_REQUEST,
              { cause: error },
          );
      }
  }

  // Delete a article via id
  @Delete('/:id')
  async deleteArticle(@Param('id') id: string) {
      try {
          return await await this.articleService.delete(id);
      } catch {
          throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: 'No such a article',
              },
              HttpStatus.NOT_FOUND,
              { cause: error },
          );
      }
  }

  // Update an article's summary (analysis)
  @Put('/:id/summary')
  async updateArticleSummary(
    @Param('id') id: string,
    @Body() updateData: { summary: string, claim: string, evidenceResult: string, researchType: string, participantType: string, isAnalysed: boolean },) {
    try {
        await this.articleService.updateSummary(id, updateData); // Call the service method
        return { message: 'Article summary updated successfully' };
    } catch (error) {
        throw new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: 'Unable to update the summary',
            },
            HttpStatus.BAD_REQUEST,
            { cause: error },
        );
    }
}
}