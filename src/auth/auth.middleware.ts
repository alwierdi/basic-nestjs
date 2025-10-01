import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: AuthenticatedRequest, res: any, next: () => void) {
    const id = req.headers['x-id'];

    if (!id) {
      throw new HttpException(
        'You are not authorized, please login!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (user) {
      req.user = user;
      next();
    } else {
      throw new HttpException(
        'You are not authorized, please login!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
