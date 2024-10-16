import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './email.schema';
import { CreateEmailDto } from './create-email.dto';

@Injectable()
export class EmailService {
  constructor(@InjectModel(Email.name) private readonly emailModel: Model<Email>) {}

  test(): string {
    return 'email route testing';
  }

  async findAll(): Promise<Email[]> {
      return await this.emailModel.find().exec();
  }

  async findByRole(role: string): Promise<Email[]> {
    return this.emailModel.find({ role }).exec();
  }

  async findOne(id: string): Promise<Email> {
      return await this.emailModel.findById(id).exec();
  }

  async create(createEmailDto: CreateEmailDto): Promise<Email> {
    return await this.emailModel.create(createEmailDto);
  }

  async update(id: string, createEmailDto: CreateEmailDto) {
    return await this.emailModel.findByIdAndUpdate(id, createEmailDto).exec();
  }

  async delete(id: string) {
      const deletedEmail = await this.emailModel.findByIdAndDelete(id).exec();
      return deletedEmail;
  }
}