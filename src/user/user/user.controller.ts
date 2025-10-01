import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { request } from 'http';
import { title } from 'process';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import type { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationFilter } from 'src/validation/validation.filter';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimestampInterceptor } from 'src/timestamp/timestamp.interceptor';
import { Auth } from 'src/auth/auth.decorator';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/current')
  current(@Auth() user: User): Record<string, any> {
    return {
      status: 200,
      message: 'success',
      data: user,
    };
  }

  @Get('/connection')
  async getConnection(): Promise<string | null> {
    this.mailService.sendMail();
    this.emailService.sendMail();
    console.info(this.memberService.getConnectionName());
    console.info(this.memberService.sendEmail());
    return this.connection.getName();
  }

  @Post('/create')
  async create(
    @Query('email') email: string,
    @Query('username') username: string,
    @Query('password') password: string,
  ): Promise<User> {
    if (!email) {
      throw new HttpException(
        {
          code: 400,
          message: 'Email is required',
        },
        400,
      );
    }
    return this.userRepository.save(email, username, password);
  }

  @Post('/login')
  @UseInterceptors(TimestampInterceptor)
  login(
    @Body(new ValidationPipe(loginUserRequestValidation))
    body: LoginUserRequest,
  ) {
    return {
      status: 200,
      message: 'success',
      data: body,
    };
  }

  @Get('/percentage/:initial/:current')
  getDetail(
    @Param('initial', ParseIntPipe) initial: number,
    @Param('current', ParseIntPipe) current: number,
  ): string {
    const result = this.service.calculateEquityPercentage(initial, current);
    return `Your return is: ${result}%`;
  }

  @Get('/profile')
  // @UseFilters(ValidationFilter)
  async getProfile(
    @Query('name') name: string,
    @Query('position') position: string,
  ): Promise<string> {
    // this.logger.info(
    //   `Received request /api/user/profile with name=${name}, position=${position}`,
    // );
    const message = this.service.sayHello(name, position);
    this.logger.info(`Responding with message: ${message}`);
    return message;
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
}
