import { Inject, Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('Create user repository');
  }

  async save(
    email: string,
    username?: string,
    password?: string,
  ): Promise<User> {
    this.logger.info(
      `Create user | email: ${email} | username: ${username} | password: ${password}`,
    );

    return this.prismaService.user.create({
      data: {
        email,
        username,
        password,
      },
    });
  }
}
