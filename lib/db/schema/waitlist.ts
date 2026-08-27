import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const leadRoleEnum = pgEnum("lead_role", ["player", "facility", "partner"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "invited",
  "archived",
]);

// Role-specific fields live in `details` (JSONB) rather than a table per role or a
// wide nullable-column table: every admin list/filter/export/metric requirement
// (§ counts by role/region/source, conversion rate) only ever touches the shared
// columns below, and this keeps the schema flexible as new participant types are
// added later. Trade-off: analytics *inside* a role's JSON fields needs raw SQL/
// JSONB operators rather than typed Drizzle columns.
export type PlayerDetails = {
  skillLevel?: string;
  simulatorFrequency?: string;
  interestedInLeaguesOrTournaments?: boolean;
};

export type FacilityDetails = {
  facilityName?: string;
  city?: string;
  state?: string;
  numberOfBays?: number;
  currentSimulatorTech?: string;
  contactName?: string;
  contactPhone?: string;
};

export type PartnerDetails = {
  company?: string;
  partnerType?: "hardware" | "software" | "other";
  website?: string;
  interestNotes?: string;
};

export type LeadDetails = PlayerDetails | FacilityDetails | PartnerDetails;

export const waitlistLeads = pgTable(
  "waitlist_leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: leadRoleEnum("role").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    location: text("location"),
    consent: boolean("consent").notNull().default(false),
    source: text("source"),
    status: leadStatusEnum("status").notNull().default("new"),
    // No FK to staff_users on purpose: this is a display-only mirror of Clerk's
    // identity (see lib/db/schema/staff.ts), populated best-effort by requireAdmin()
    // and the Clerk webhook — it must never be the reason a write fails.
    assignedToUserId: text("assigned_to_user_id"),
    followUpDueAt: timestamp("follow_up_due_at", { withTimezone: true }),
    details: jsonb("details").notNull().default({}).$type<LeadDetails>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_leads_role").on(t.role),
    index("idx_leads_status").on(t.status),
    index("idx_leads_created").on(t.createdAt),
  ]
);

export const leadNotes = pgTable("lead_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => waitlistLeads.id, { onDelete: "cascade" }),
  authorUserId: text("author_user_id"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadStatusHistory = pgTable("lead_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => waitlistLeads.id, { onDelete: "cascade" }),
  oldStatus: leadStatusEnum("old_status"),
  newStatus: leadStatusEnum("new_status").notNull(),
  changedByUserId: text("changed_by_user_id"),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WaitlistLead = typeof waitlistLeads.$inferSelect;
export type NewWaitlistLead = typeof waitlistLeads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type LeadStatusHistoryEntry = typeof leadStatusHistory.$inferSelect;
