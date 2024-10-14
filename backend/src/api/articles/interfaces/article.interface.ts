import { Document } from 'mongoose';

export interface Article extends Document {
  readonly title: string;
  readonly authors: string;
  readonly source: string;
  readonly pubYear: number; // Changed to number
  readonly volume: string;
  readonly number: string;
  readonly pages: string;
  readonly doi: string;
  readonly summary: string;
  readonly status: string;
  readonly seMethod: string; // Added SE Method field
  readonly averageRating: number; // Added average rating field
}