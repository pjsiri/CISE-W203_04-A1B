import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailDocument = HydratedDocument<Email>;

@Schema()
export class Email {
    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    email: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);