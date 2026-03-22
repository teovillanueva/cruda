import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { photo, save, follow } from "./platform";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  photos: many(photo),
  saves: many(save),
  followers: many(follow, { relationName: "following" }),
  following: many(follow, { relationName: "followers" }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const photoRelations = relations(photo, ({ one, many }) => ({
  user: one(user, { fields: [photo.userId], references: [user.id] }),
  saves: many(save),
}));

export const saveRelations = relations(save, ({ one }) => ({
  user: one(user, { fields: [save.userId], references: [user.id] }),
  photo: one(photo, { fields: [save.photoId], references: [photo.id] }),
}));

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
    relationName: "followers",
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
    relationName: "following",
  }),
}));
