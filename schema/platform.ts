import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const photo = pgTable(
  "photo",
  {
    id: text("id").primaryKey(),
    title: text("title"),
    description: text("description"),
    url: text("url").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("photo_userId_idx").on(table.userId)],
);

export const save = pgTable(
  "save",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    photoId: text("photo_id")
      .notNull()
      .references(() => photo.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.photoId] }),
    index("save_photoId_idx").on(table.photoId),
  ],
);

export const follow = pgTable(
  "follow",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index("follow_followingId_idx").on(table.followingId),
  ],
);
