ALTER TABLE "like" RENAME TO "save";--> statement-breakpoint
ALTER TABLE "save" DROP CONSTRAINT "like_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "save" DROP CONSTRAINT "like_photo_id_photo_id_fk";
--> statement-breakpoint
DROP INDEX "like_photoId_idx";--> statement-breakpoint
ALTER TABLE "save" DROP CONSTRAINT "like_user_id_photo_id_pk";--> statement-breakpoint
ALTER TABLE "save" ADD CONSTRAINT "save_user_id_photo_id_pk" PRIMARY KEY("user_id","photo_id");--> statement-breakpoint
ALTER TABLE "save" ADD CONSTRAINT "save_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "save" ADD CONSTRAINT "save_photo_id_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "save_photoId_idx" ON "save" USING btree ("photo_id");