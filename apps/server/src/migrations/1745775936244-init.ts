import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1745775936244 implements MigrationInterface {
  name = 'Init1745775936244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "user_right" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "alias" character varying(50) NOT NULL,
              "uaName" character varying(100) NOT NULL,
              "enName" character varying(100) NOT NULL,
              "uaDescription" character varying(500),
              "enDescription" character varying(500),
              CONSTRAINT "PK_86fe16b95dcb66a98ff99eb3348" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "user_role_user_right" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "userRoleId" integer NOT NULL,
              "userRightId" integer NOT NULL,
              CONSTRAINT "UQ_1c4e215584bb6ce2ce3cbdcc4e6" UNIQUE ("userRoleId", "userRightId"),
              CONSTRAINT "PK_81cb4d0f30571b21f6fc9c9285e" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "user_role" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "name" character varying(50) NOT NULL,
              "alias" character varying(50) NOT NULL,
              CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "user_user_role" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "userId" integer NOT NULL,
              "userRoleId" integer NOT NULL,
              CONSTRAINT "UQ_b434be8009139198af8f4cbac53" UNIQUE ("userId", "userRoleId"),
              CONSTRAINT "PK_078f27c5e6a46cb1ab1b9fd463b" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "user" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "name" character varying(250) NOT NULL,
              "email" character varying(250) NOT NULL,
              "isEmailVerified" boolean NOT NULL DEFAULT false,
              "phoneNumber" character varying(15),
              "googleId" character varying,
              "passwordHash" character varying,
              "refreshToken" character varying,
              CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
              CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "store_theme" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "name" character varying(50) NOT NULL,
              "alias" character varying(50) NOT NULL,
              CONSTRAINT "PK_765e0281fd810270fa3f2051ab9" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          CREATE TABLE "store_main_settings" (
              "id" SERIAL NOT NULL,
              "createdByUserId" integer,
              "createdDate" TIMESTAMP WITH TIME ZONE,
              "updatedByUserId" integer,
              "updatedDate" TIMESTAMP WITH TIME ZONE,
              "isUserAuthEnabled" boolean NOT NULL DEFAULT true,
              "isSearchInHeaderEnabled" boolean NOT NULL DEFAULT true,
              "isFavoritesEnabled" boolean NOT NULL DEFAULT true,
              "isCommentsEnabled" boolean NOT NULL DEFAULT true,
              "isProductRatingEnabled" boolean NOT NULL DEFAULT true,
              "isThemeTogglerEnabled" boolean NOT NULL DEFAULT true,
              "storeThemeId" integer NOT NULL,
              CONSTRAINT "PK_5d3421a77fd11b05226b44feba3" PRIMARY KEY ("id")
          )
      `);
    await queryRunner.query(`
          ALTER TABLE "user_role_user_right"
          ADD CONSTRAINT "FK_0d79a5a88fbb9233cce32085a89" FOREIGN KEY ("userRoleId") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
          ALTER TABLE "user_role_user_right"
          ADD CONSTRAINT "FK_193fc8ef8d707f59c80c334fa55" FOREIGN KEY ("userRightId") REFERENCES "user_right"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
          ALTER TABLE "user_user_role"
          ADD CONSTRAINT "FK_7747a337d9b6e1ec74dbac34edf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
          ALTER TABLE "user_user_role"
          ADD CONSTRAINT "FK_0ee9e915ff2ec7a1c4f2c8acdb2" FOREIGN KEY ("userRoleId") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
          ALTER TABLE "store_main_settings"
          ADD CONSTRAINT "FK_6a39a6190d3e981b60ddd46a2d5" FOREIGN KEY ("storeThemeId") REFERENCES "store_theme"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "store_main_settings" DROP CONSTRAINT "FK_6a39a6190d3e981b60ddd46a2d5"
      `);
    await queryRunner.query(`
          ALTER TABLE "user_user_role" DROP CONSTRAINT "FK_0ee9e915ff2ec7a1c4f2c8acdb2"
      `);
    await queryRunner.query(`
          ALTER TABLE "user_user_role" DROP CONSTRAINT "FK_7747a337d9b6e1ec74dbac34edf"
      `);
    await queryRunner.query(`
          ALTER TABLE "user_role_user_right" DROP CONSTRAINT "FK_193fc8ef8d707f59c80c334fa55"
      `);
    await queryRunner.query(`
          ALTER TABLE "user_role_user_right" DROP CONSTRAINT "FK_0d79a5a88fbb9233cce32085a89"
      `);
    await queryRunner.query(`
          DROP TABLE "store_main_settings"
      `);
    await queryRunner.query(`
          DROP TABLE "store_theme"
      `);
    await queryRunner.query(`
          DROP TABLE "user"
      `);
    await queryRunner.query(`
          DROP TABLE "user_user_role"
      `);
    await queryRunner.query(`
          DROP TABLE "user_role"
      `);
    await queryRunner.query(`
          DROP TABLE "user_role_user_right"
      `);
    await queryRunner.query(`
          DROP TABLE "user_right"
      `);
  }
}
