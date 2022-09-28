import { v4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1664215326596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'date',
          },
          {
            name: 'updated_at',
            type: 'date',
          },
        ],
      })
    );

    const id = v4();
    const name = 'Matheus Miranda Ferreira';
    const email = 'matheusdemirandaferreira@gmail.com';
    const salt = await bcrypt.genSalt(8);
    const password = await bcrypt.hash('123456', salt);
    const date = new Date().toJSON();

    await queryRunner.query(
      `INSERT INTO "user" (ID,NAME,EMAIL,PASSWORD,CREATED_AT,UPDATED_AT) VALUES ('${id}', '${name}', '${email}', '${password}', '${date}', '${date}')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
