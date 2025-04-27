import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROOT_USER_ID } from '../common/constants';

export class InitData1745776190807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" ("id","name","email","isEmailVerified","phoneNumber","googleId","passwordHash","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 'Root', 'nazarii.dev@gmail.com', true, null, null, '$2a$12$QgK4LXkTZCVTA6DvfiffNuOnYtnTQVoyObZPVjlj3yHK.vfH/9fK.', null, now(), null, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_id_seq RESTART WITH 2;
      `);

    await queryRunner.query(`
        INSERT INTO "user_role" ("id","name","alias","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 'Root', 'root', ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (2, 'Admin', 'admin', ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (3, 'Client', 'client', ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_role_id_seq RESTART WITH 4;
      `);

    await queryRunner.query(`
        INSERT INTO "user_right" ("id","alias","uaName","enName","uaDescription","enDescription","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 'logo_change', 'Редагування логотипу', 'Edit logo', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (2, 'theme_change', 'Редагування теми', 'Edit theme', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (3, 'product_create', 'Створення продукту', 'Create product', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (4, 'product_edit', 'Редагування продукту', 'Edit product', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (5, 'product_delete', 'Видалення продукту', 'Delete product', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (6, 'category_create', 'Створення категорії продукту', 'Create product category', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (7, 'category_edit', 'Редагування категорії продукту', 'Edit product category', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (8, 'category_delete', 'Видалення категорії продукту', 'Delete product category', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_right_id_seq RESTART WITH 9;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
