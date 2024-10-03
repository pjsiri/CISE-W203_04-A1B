import { Document } from 'mongoose';
export interface Article extends Document {
    readonly title: string;
    readonly authors: string;
    readonly source: string;
    readonly pubYear: number;
    readonly doi: string;
    readonly claim: string;
    readonly evidence: string;
}
