const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692587532411 {
    name = 'Migration1692587532411'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "calling_method" varchar NOT NULL, "trace_id" varchar NOT NULL, "date" datetime NOT NULL, "level" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "active" boolean NOT NULL, "admin" boolean NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer, CONSTRAINT "FK_c6686efa4cd49fa9a429f01bac8" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report"("id", "approved", "price", "make", "model", "year", "latitude", "longitude", "mileage", "user_id") SELECT "id", "approved", "price", "make", "model", "year", "latitude", "longitude", "mileage", "user_id" FROM "report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`ALTER TABLE "temporary_report" RENAME TO "report"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "report" RENAME TO "temporary_report"`);
        await queryRunner.query(`CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "mileage" integer NOT NULL, "user_id" integer)`);
        await queryRunner.query(`INSERT INTO "report"("id", "approved", "price", "make", "model", "year", "latitude", "longitude", "mileage", "user_id") SELECT "id", "approved", "price", "make", "model", "year", "latitude", "longitude", "mileage", "user_id" FROM "temporary_report"`);
        await queryRunner.query(`DROP TABLE "temporary_report"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "log"`);
    }
}
