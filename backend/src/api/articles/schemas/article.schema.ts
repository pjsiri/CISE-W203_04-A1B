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

    @Prop()
    pubYear: string;

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
}

export const ArticleSchema = SchemaFactory.createForClass(Article);