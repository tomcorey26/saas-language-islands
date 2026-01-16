ALTER TABLE "cards" ADD COLUMN "next_review_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "interval" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "ease_factor" integer DEFAULT 250 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "base_language" "language";--> statement-breakpoint
CREATE INDEX "cards.deck_id_next_review_index" ON "cards" USING btree ("deck_id","next_review_date");