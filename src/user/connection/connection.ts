import { Injectable } from '@nestjs/common';

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
