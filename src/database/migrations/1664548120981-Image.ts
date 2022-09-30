import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Image1664548120981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'image',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'post_id',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_post_id',
            columnNames: ['post_id'],
            referencedTableName: 'post',
            referencedColumnNames: ['id'],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
  }
}
