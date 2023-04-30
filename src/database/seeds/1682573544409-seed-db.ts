import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1682573544409 implements MigrationInterface {
  name = 'SeedDB1682573544409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // password is Password@123
      `INSERT INTO users (username, email, password, role, "isActivated") VALUES ('Vsevolod', 'vsevolod.dev@gmail.com', '$2b$10$omA1eAaEZFKEaAkDCQ2DU.QUIe2JTcfynMs6Ayhxj3NclXlNpodIS', 'admin', true)`,
    );
    await queryRunner.query(
      // password is Password@123
      `INSERT INTO users (username, email, password, role, "isActivated") VALUES ('user', 'user@gmail.com', '$2b$10$omA1eAaEZFKEaAkDCQ2DU.QUIe2JTcfynMs6Ayhxj3NclXlNpodIS', 'user', false)`,
    );
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('admin')`);
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('user')`);
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
