import { Schema } from 'mongoose';

export const ArticleSchema = new Schema({
  title: String,
  authors: String,
  source: String,
  pubYear: Number,
  volume: Number,
  number: Number,
  pages: String,
  doi: String,
  summary: String,
  status: String,
});