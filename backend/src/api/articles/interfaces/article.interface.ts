import { Document } from 'mongoose';

export interface Article extends Document {
  readonly title: string;
  readonly authors: string;
  readonly source: string;
  readonly pubYear: number;
  readonly volume: string;
  readonly number: string;
  readonly pages: string;
  readonly doi: string;
  readonly seMethod: string;
  readonly summary: string;
  readonly status: string;
  readonly averageRating: number;
}