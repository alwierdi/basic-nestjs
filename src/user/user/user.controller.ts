import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { request } from 'http';
import { title } from 'process';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
  ) {}

  @Get('/connection')
  async getConnection(): Promise<string | null> {
    this.userRepository.save();
    this.mailService.sendMail();
    this.emailService.sendMail();
    return this.connection.getName();
  }

  // Versi Express JS
  @Get('/base')
  baseResponse(@Res() response: Response) {
    response.status(200).send({
      status: 200,
      message: 'success',
      data: [],
    });
  }

  // Versi Nest JS
  @Get('/custom-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  customResponse(): Record<string, any> {
    return {
      message: 'success',
      data: [],
    };
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send({
      status: 200,
      message: 'success set cookie',
    });
  }

  @Get('get-cookie')
  getCookie(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Get('/redirect')
  @Redirect()
  redirect() {
    return {
      url: 'https://youtube.com',
      statusCode: 301,
    };
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }

  @Post('/create')
  create() {
    return 'create user';
  }
  @Get('/getAll')
  getAll() {
    return 'get all users';
  }

  @Get('/detail/:id')
  getDetail(@Param('id') id: string): string {
    return `Hii, im no.${id}!`;
  }

  @Get('/profile')
  async getProfile(
    @Query('name') name: string,
    @Query('position') position: string,
  ): Promise<string> {
    return this.service.sayHello(name, position);
  }
}
