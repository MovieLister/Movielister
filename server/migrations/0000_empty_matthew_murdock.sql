-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text
);
