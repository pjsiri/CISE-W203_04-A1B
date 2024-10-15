import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
  } from '@nestjs/common';
  import { EmailService } from './email.service';
  import { CreateEmailDto } from './create-email.dto';
  import { error } from 'console';
  
  @Controller('api/emails')
  export class EmailController {
    constructor(private readonly emailService: EmailService) {}
  
    @Get('/test')
    test() {
        return this.emailService.test();
    }
  
    // Get all emails or filter by role using query params
    @Get('/')
    async findAll(@Query('role') role?: string) {
        console.log('Role Query:', role); // Log the query parameter
    
        try {
            if (role) {
                // Log the filtered response
                console.log(`Fetching emails with role: ${role}`);
                return await this.emailService.findByRole(role);
            } else {
                console.log('Fetching all emails');
                return await this.emailService.findAll();
            }
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'No Email found',
                },
                HttpStatus.NOT_FOUND,
                { cause: error },
            );
        }
    }
  
    // Get one email via id
    @Get('/:id')
    async findOne(@Param('id') id: string) {
        try {
            return this.emailService.findOne(id);
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'No Email found',
                },
                HttpStatus.NOT_FOUND,
                { cause: error },
            );
        }
    }
  
    // Create/add a email
    @Post('/')
    async addEmail(@Body() createEmailDto: CreateEmailDto) {
        try {
            await this.emailService.create(createEmailDto);
            return { message: 'Email added successfully' };
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to add this email',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }
  
    // Update a email
    @Put('/:id')
    async updateEmail(
        @Param('id') id: string,
        @Body() createEmailDto: CreateEmailDto,
    ) {
        try {
            await this.emailService.update(id, createEmailDto);
            return { message: 'Email updated successfully' };
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Unable to update this email',
                },
                HttpStatus.BAD_REQUEST,
                { cause: error },
            );
        }
    }
  
    // Delete a email via id
    @Delete('/:id')
    async deleteEmail(@Param('id') id: string) {
        try {
            return await await this.emailService.delete(id);
        } catch {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'No such a email',
                },
                HttpStatus.NOT_FOUND,
                { cause: error },
            );
        }
    }
  }