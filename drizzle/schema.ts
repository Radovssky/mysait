import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * projects — кейсы Раду. На главной показываются опубликованные карточки,
 * на /projects/[slug] открывается полная страница со скриншотами и отзывом.
 */
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  coverImage: text("cover_image"),
  category: text("category"),
  client: text("client"),
  context: text("context"),
  solution: text("solution"),
  stack: text("stack").array(),
  result: text("result"),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projectScreenshots = pgTable("project_screenshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  imagePath: text("image_path").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  text: text("text").notNull(),
  photoPath: text("photo_path"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * users — единственный пользователь (Раду) для Auth.js Credentials provider.
 * Сидится одноразовым скриптом scripts/seed-admin.ts.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectScreenshot = typeof projectScreenshots.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type User = typeof users.$inferSelect;
