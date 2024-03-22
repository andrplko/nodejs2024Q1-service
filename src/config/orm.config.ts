import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';

config();

const postgresDatabase: DatabaseType = 'postgres';
const typeOrmConfig: TypeOrmModuleOptions = {
  type: postgresDatabase,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [],
  synchronize: true,
  autoLoadEntities: true,
};

export { typeOrmConfig };
