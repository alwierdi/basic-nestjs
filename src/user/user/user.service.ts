import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  sayHello(name: string, position: string): string {
    return `Hii, ${name}!, you are ${position}`;
  }
}
