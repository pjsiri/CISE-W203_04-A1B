import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './email.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    ],
    controllers: [EmailController],
    providers: [EmailService],
})

export class EmailModule {}
