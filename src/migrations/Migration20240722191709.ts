import { Migration } from '@mikro-orm/migrations';

/**
 * @description Modifies a database by creating and altering tables, adding constraints,
 * and setting default values for columns.
 * 
 * @extends {Migration}
 */
export class Migration20240722191709 extends Migration {

  /**
   * @description Creates and modifies tables, adding columns and constraints, and
   * updating data types and default values for the `post` table.
   * 
   * @returns {Promise<void>} An object that represents a promise that will be resolved
   * when the asynchronous operation is complete.
   */
  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "created_at" set default \'now()\';');
  }

  /**
   * @description Modifies two tables in a database: "user" and "post". The modifications
   * include dropping the default value from the "created_at" column in the "post"
   * table, and changing its data type to "timestamptz(6)".
   * 
   * @returns {Promise<void>} A promise that resolves to no value.
   */
  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "post" alter column "created_at" drop default;');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));');
  }

}
