ALTER TABLE "lead_notes" DROP CONSTRAINT "lead_notes_author_user_id_staff_users_clerk_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lead_status_history" DROP CONSTRAINT "lead_status_history_changed_by_user_id_staff_users_clerk_user_id_fk";
--> statement-breakpoint
ALTER TABLE "waitlist_leads" DROP CONSTRAINT "waitlist_leads_assigned_to_user_id_staff_users_clerk_user_id_fk";
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_author_user_id_staff_users_clerk_user_id_fk";
