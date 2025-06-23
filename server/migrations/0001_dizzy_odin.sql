CREATE TABLE "license_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"license_id" varchar(100) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"activity" text NOT NULL,
	"ip_address" varchar(50),
	"user_agent" varchar(255),
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "license_activities" ADD CONSTRAINT "license_activities_license_id_licenses_license_key_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("license_key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "license_activities" ADD CONSTRAINT "license_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_plans" DROP COLUMN "interval";--> statement-breakpoint
ALTER TABLE "subscription_plans" DROP COLUMN "max_users";