import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/validation/validation/validation.service';
import { Logger } from 'winston';
import z from 'zod';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  sayHello(name: string, position: string): string {
    const schema = z.string().min(3).max(100);
    const validateName = this.validationService.validate(schema, name);
    this.logger.info(`Validated name: ${validateName}`);

    return `Hii, ${validateName}!, you are ${position}`;
  }

  calculateEquityPercentage(initial: number, current: number): number {
    if (initial === 0) {
      throw new Error('Initial capital cannot be zero');
    }

    const percent = ((current - initial) / initial) * 100;
    this.logger.info(
      `Initial: ${initial}, Current: ${current}, Change: ${percent.toFixed(2)}%`,
    );
    return percent;
  }
}
