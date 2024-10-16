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

    @Prop({ required: true, type: Number })
    pubYear: number;

    @Prop()
    volume: string;

    @Prop()
    number: string;

    @Prop()
    pages: string;

    @Prop()
    doi: string;

    @Prop({ default: "" })
    seMethod: string;

    @Prop()
    summary: string;

    @Prop()
    status: string;

    @Prop()
    submitterName: string;

    @Prop()
    submitterEmail: string;

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    totalRating: number;
  
    @Prop({ default: 0 })
    numberOfRatings: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);