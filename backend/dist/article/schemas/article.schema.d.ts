import { Schema } from 'mongoose';
export declare const ArticleSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    title?: string;
    authors?: string;
    source?: string;
    pubYear?: number;
    doi?: string;
    claim?: string;
    evidence?: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title?: string;
    authors?: string;
    source?: string;
    pubYear?: number;
    doi?: string;
    claim?: string;
    evidence?: string;
}>> & import("mongoose").FlatRecord<{
    title?: string;
    authors?: string;
    source?: string;
    pubYear?: number;
    doi?: string;
    claim?: string;
    evidence?: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
