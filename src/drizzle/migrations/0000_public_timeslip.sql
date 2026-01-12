CREATE TYPE "public"."difficulty" AS ENUM('again', 'difficult', 'good', 'easy');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."error_severity" AS ENUM('minor', 'moderate', 'major');--> statement-breakpoint
CREATE TYPE "public"."error_type" AS ENUM('grammar', 'vocabulary', 'pronunciation', 'context');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ja', 'de', 'ko', 'it', 'tr', 'vi', 'pl', 'uk', 'ro', 'nl', 'el', 'cs', 'hu', 'sv', 'bg', 'hr', 'sk', 'sl', 'lt', 'lv', 'no', 'da', 'fi');--> statement-breakpoint
CREATE TYPE "public"."feature_request_priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."feature_request_status" AS ENUM('pending', 'in_progress', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"island_id" uuid NOT NULL,
	"phrase" varchar(500) NOT NULL,
	"translation" varchar(500) NOT NULL,
	"difficulty" "difficulty" DEFAULT 'again' NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"custom_prompt" text NOT NULL,
	"status" "conversation_status" DEFAULT 'active' NOT NULL,
	"tokens_charged" integer DEFAULT 5 NOT NULL,
	"total_messages" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"conversation_summary" text,
	"summary_token_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "conversation_errors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"error_type" "error_type" NOT NULL,
	"error_text" text NOT NULL,
	"correction" text NOT NULL,
	"explanation" text NOT NULL,
	"severity" "error_severity" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"emoji" text DEFAULT '🏝️' NOT NULL,
	"language" "language" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"user_name" varchar(255),
	"status" "feature_request_status" DEFAULT 'pending' NOT NULL,
	"priority" "feature_request_priority" DEFAULT 'medium' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "islands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"deck_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"translation" text,
	"has_error" boolean DEFAULT false,
	"token_count" integer DEFAULT 0 NOT NULL,
	"is_in_summary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"tokens_purchased" integer NOT NULL,
	"amount_paid_cents" integer NOT NULL,
	"stripe_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "purchases_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"stripe_customer_id" text,
	"tokens_balance" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_island_id_islands_id_fk" FOREIGN KEY ("island_id") REFERENCES "public"."islands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_clerk_user_id_users_clerk_user_id_fk" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_errors" ADD CONSTRAINT "conversation_errors_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_errors" ADD CONSTRAINT "conversation_errors_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "islands" ADD CONSTRAINT "islands_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cards.deck_id_index" ON "cards" USING btree ("deck_id");--> statement-breakpoint
CREATE INDEX "conversations.clerk_user_id_index" ON "conversations" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "conversations.status_index" ON "conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversation_errors.conversation_id_index" ON "conversation_errors" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "decks.clerk_user_id_index" ON "decks" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "messages.conversation_id_index" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages.created_at_index" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "purchases.clerk_user_id_index" ON "purchases" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "purchases.stripe_session_id_index" ON "purchases" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE INDEX "purchases.stripe_customer_id_index" ON "purchases" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "users.clerk_user_id_index" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "users.stripe_customer_id_index" ON "users" USING btree ("stripe_customer_id");