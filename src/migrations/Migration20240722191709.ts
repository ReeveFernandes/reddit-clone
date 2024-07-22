import { Migration } from '@mikro-orm/migrations';

export class Migration20240722191709 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "post" alter column "created_at" set default \'now()\';');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');

    this.addSql('alter table "post" alter column "created_at" drop default;');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));');
  }

}
