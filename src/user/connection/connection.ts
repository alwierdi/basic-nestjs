import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Connection {
  getName(): string | null {
    return null;
  }
}

@Injectable()
export class MongoDBConnection extends Connection {
  getName(): string {
    return 'MongoDB';
  }
}

@Injectable()
export class PostgreSQLConnection extends Connection {
  getName(): string {
    return 'PostgreSQL';
  }
}

export function createConnection(configService: ConfigService): Connection {
  if (configService.get('DATABASE_TYPE') === 'postgresql') {
    return new PostgreSQLConnection();
  }
  return new MongoDBConnection();
}
