CREATE TYPE "public"."staff_role" AS ENUM('admin', 'staff');--> statement-breakpoint
CREATE TYPE "public"."lead_role" AS ENUM('player', 'facility', 'partner');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'invited', 'archived');--> statement-breakpoint
CREATE TABLE "staff_users" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" "staff_role" DEFAULT 'staff' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"author_user_id" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"old_status" "lead_status",
	"new_status" "lead_status" NOT NULL,
	"changed_by_user_id" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "lead_role" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"location" text,
	"consent" boolean DEFAULT false NOT NULL,
	"source" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"assigned_to_user_id" text,
	"follow_up_due_at" timestamp with time zone,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content_html" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"category_id" uuid,
	"author_user_id" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_waitlist_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."waitlist_leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_author_user_id_staff_users_clerk_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."staff_users"("clerk_user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_lead_id_waitlist_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."waitlist_leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_status_history" ADD CONSTRAINT "lead_status_history_changed_by_user_id_staff_users_clerk_user_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."staff_users"("clerk_user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_leads" ADD CONSTRAINT "waitlist_leads_assigned_to_user_id_staff_users_clerk_user_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."staff_users"("clerk_user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_user_id_staff_users_clerk_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."staff_users"("clerk_user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_leads_role" ON "waitlist_leads" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "waitlist_leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_created" ON "waitlist_leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_posts_published" ON "blog_posts" USING btree ("is_published","published_at");