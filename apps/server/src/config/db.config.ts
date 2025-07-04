import * as dotenv from 'dotenv';
import { User } from '../entities/store/user.entity';
import { UserRole } from '../entities/store/user-role.entity';
import { UserUserRole } from '../entities/store/user-user-role.entity';
import { StoreMainSettings } from '../entities/admin/store-main-settings.entity';
import { StoreTheme } from '../entities/admin/store-theme.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Init1745775936244 } from '../migrations/1745775936244-init';
import { InitData1745776190807 } from '../migrations/1745776190807-initData';
import { UserRight } from '../entities/store/user-right.entity';
import { UserRoleUserRight } from '../entities/store/user-role-user-right.entity';
dotenv.config();

export default (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    logging: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      User,
      UserRole,
      UserUserRole,
      UserRight,
      UserRoleUserRight,
      StoreMainSettings,
      StoreTheme,
    ],
    synchronize: false,
    migrations: [Init1745775936244, InitData1745776190807],
    migrationsRun: true,
  };
};
