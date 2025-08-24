import { Injectable } from '@nestjs/common';

export class MailService {
  sendMail() {
    console.info('Send email');
  }
}

export const MailServiceProvider = new MailService();
