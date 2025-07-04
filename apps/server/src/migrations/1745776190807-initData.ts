import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROOT_USER_ID } from '../common/constants';

export class InitData1745776190807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" ("id","name","email","isEmailVerified","phoneNumber","googleId","passwordHash","refreshToken","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 'Root', 'nazarii.dev@gmail.com', true, null, null, '$2a$12$QgK4LXkTZCVTA6DvfiffNuOnYtnTQVoyObZPVjlj3yHK.vfH/9fK.', null, null, now(), null, now())
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
        (9, 'role_rights_change', 'Зміна прав ролей', 'Change role rights', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (10, 'user_create', 'Створення користувача', 'Create user', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (11, 'user_delete', 'Видалення користувача', 'Delete user', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (12, 'user_edit', 'Редагування користувача', 'Edit user', null, null, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_right_id_seq RESTART WITH 13;
      `);

    await queryRunner.query(`
        INSERT INTO "user_role_user_right" ("id","userRoleId","userRightId","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 1, 1, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (2, 1, 2, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (3, 1, 3, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (4, 1, 4, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (5, 1, 5, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (6, 1, 6, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (7, 1, 7, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (8, 1, 8, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (9, 1, 9, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (10, 1, 10, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (11, 1, 11, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (12, 1, 12, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (13, 2, 1, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (14, 2, 2, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (15, 2, 3, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (16, 2, 4, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (17, 2, 5, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (18, 2, 6, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (19, 2, 7, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (20, 2, 8, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (21, 2, 9, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (22, 2, 10, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (23, 2, 11, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (24, 2, 12, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_role_user_right_id_seq RESTART WITH 25;
      `);

    await queryRunner.query(`
        INSERT INTO "user_user_role" ("id","userId","userRoleId","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 1, 1, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE user_user_role_id_seq RESTART WITH 2;
      `);

    await queryRunner.query(`
        INSERT INTO "store_theme" ("id","name","alias","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, 'White', 'white', ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now()),
        (2, 'Dark', 'dark', ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE store_theme_id_seq RESTART WITH 3;
      `);

    await queryRunner.query(`
        INSERT INTO "store_main_settings" ("id","isUserAuthEnabled","isSearchInHeaderEnabled","isFavoritesEnabled","isCommentsEnabled","isProductRatingEnabled","isThemeTogglerEnabled","storeThemeId","createdByUserId","createdDate","updatedByUserId","updatedDate") VALUES
        (1, true, true, true, true, true, true, 1, ${ROOT_USER_ID}, now(), ${ROOT_USER_ID}, now())
      `);
    await queryRunner.query(`
        ALTER SEQUENCE store_main_settings_id_seq RESTART WITH 2;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
