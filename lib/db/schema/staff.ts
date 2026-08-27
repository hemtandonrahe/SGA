import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const staffRoleEnum = pgEnum("staff_role", ["admin", "staff"]);

// Clerk owns identity/auth. This table mirrors just enough (via a webhook)
// so notes/assignees can render a name without a Clerk API call per row.
export const staffUsers = pgTable("staff_users", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  role: staffRoleEnum("role").notNull().default("staff"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StaffUser = typeof staffUsers.$inferSelect;
export type NewStaffUser = typeof staffUsers.$inferInsert;
