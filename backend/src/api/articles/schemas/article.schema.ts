import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import { Article } from '../interfaces/article.interface';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    authors: string;

    @Prop({ required: true })
    source: string;

    @Prop({ required: true, type: Number }) // Changed to number
    pubYear: number; // Changed to number

    @Prop()
    volume: string;

    @Prop()
    number: string;

    @Prop()
    pages: string;

    @Prop()
    doi: string;

    @Prop()
    seMethod: string;

    @Prop()
    summary: string;

    @Prop()
    status: string;

    @Prop({ default: "" })
    seMethod: string; // Added SE Method field
  
    @Prop({ default: 0 })
    averageRating: number; // Added average rating field
}

export const ArticleSchema = SchemaFactory.createForClass(Article);