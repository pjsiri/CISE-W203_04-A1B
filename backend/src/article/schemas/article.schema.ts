import { Schema } from 'mongoose';

export const ArticleSchema = new Schema({
  title: String,
  authors: String,
  source: String,
  pubYear: Number,
  doi: String,
  claim: String,
  evidence: String,
});