// In: src/db/schema.ts
// 1. Import 'index'
import { pgTable, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'; 
import { relations } from 'drizzle-orm';

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // 2. Change 'uniqueIndex' to 'index'
  userIndex: index('user_idx').on(table.userId), 
}));

// ... rest of the file is unchanged ...
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').references(() => conversations.id).notNull(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));