import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from '../connection/connection';
import { MailService, MailServiceProvider } from '../mail/mail.service';

@Injectable()
export class MemberService {
  constructor(private moduleRef: ModuleRef) {}

  getConnectionName(): string | null {
    const connection = this.moduleRef.get(Connection);
    return connection.getName();
  }

  sendEmail() {
    const emailService = this.moduleRef.get(MailService);
    emailService.sendMail();
  }
}
