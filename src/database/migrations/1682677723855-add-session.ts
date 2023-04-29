import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSession1682677723855 implements MigrationInterface {
  name = 'AddSession1682677723855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "UQ_57de40bc620f456c7311aa3a1e6" UNIQUE ("userId"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
