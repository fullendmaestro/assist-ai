import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";

// represent user
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(), // user id
  email: varchar("email", { length: 64 }).notNull(), // email
  password: varchar("password", { length: 64 }), // password
});

export type User = InferSelectModel<typeof user>;

// represent chat
export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(), // chat id
  createdAt: timestamp("createdAt").notNull(), // creation timestamp
  title: text("title").notNull(), // chat title
  userId: uuid("userId")
    .notNull()
    .references(() => user.id), // reference to user id
});

export type Chat = InferSelectModel<typeof chat>;

// represent message
export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(), // message id
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id), // reference to chat id
  role: varchar("role").notNull(), // role of the message sender
  content: json("content").notNull(), // message content
  createdAt: timestamp("createdAt").notNull(), // creation timestamp
});

export type Message = InferSelectModel<typeof message>;

// represent vote
export const vote = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id), // reference to chat id
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id), // reference to message id
    isUpvoted: boolean("isUpvoted").notNull(), // upvote status
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }), // composite primary key
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

// represent document
export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(), // document id
    createdAt: timestamp("createdAt").notNull(), // creation timestamp
    title: text("title").notNull(), // document title
    content: text("content"), // document content
    userId: uuid("userId")
      .notNull()
      .references(() => user.id), // reference to user id
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }), // composite primary key
    };
  }
);

export type Document = InferSelectModel<typeof document>;

// represent suggestion
export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(), // suggestion id
    documentId: uuid("documentId").notNull(), // reference to document id
    documentCreatedAt: timestamp("documentCreatedAt").notNull(), // reference to document creation timestamp
    originalText: text("originalText").notNull(), // original text
    suggestedText: text("suggestedText").notNull(), // suggested text
    description: text("description"), // description of the suggestion
    isResolved: boolean("isResolved").notNull().default(false), // resolution status
    userId: uuid("userId")
      .notNull()
      .references(() => user.id), // reference to user id
    createdAt: timestamp("createdAt").notNull(), // creation timestamp
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }), // primary key
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt], // foreign key columns
      foreignColumns: [document.id, document.createdAt], // referenced columns
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;
