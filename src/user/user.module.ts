import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import {
  Connection,
  MongoDBConnection,
  PostgreSQLConnection,
} from './connection/connection';
import { MailService, MailServiceProvider } from './mail/mail.service';
import {
  createUserRepository,
  UserRepository,
} from './user-repository/user-repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Connection,
      useClass:
        process.env.DATABASE === 'postgresql'
          ? PostgreSQLConnection
          : MongoDBConnection,
    },
    {
      provide: MailService,
      useValue: MailServiceProvider,
    },
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    {
      provide: UserRepository,
      useFactory: createUserRepository,
      inject: [Connection],
    },
  ],
})
export class UserModule {}
