import { Migration } from '@mikro-orm/migrations';

/**
 * @description Updates a database by creating and modifying tables, adding constraints,
 * and changing data types to ensure proper functionality.
 * 
 * @extends {Migration}
 */
export class Migration20240722191709 extends Migration {

  /**
   * @description Creates and modifies tables and columns in a database, including
   * adding a unique constraint on the "username" column of the "user" table and altering
   * the data types of the "created_at" column of both the "post" and "user" tables.
   * 
   * @returns {Promise<void>} A promise that resolves to no value.
   */
  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "created_at" set default \'now()\';');
  }

  /**
   * @description Modifies two database tables: "user" and "post". The changes include
   * dropping a default value from a column named "created_at" in the "post" table, and
   * changing its data type to timestamp(6) using the existing value.
   * 
   * @returns {Promise<void>} A promise that resolves to no value.
   */
  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "post" alter column "created_at" drop default;');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));');
  }

}
