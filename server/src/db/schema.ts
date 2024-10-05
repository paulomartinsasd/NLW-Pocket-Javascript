import {pgTable, text, integer, timestamp} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    desiredWeeklyFrenquency: integer('desired_weekly_frequency').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true})
        .notNull() //Não pode ser Nulo
        .defaultNow(), // preenche automaticamente com a data atual
})

export const goalCompletions = pgTable('goal_completions', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    goalId: text('goal_id').references(() => goals.id).notNull(), // chave estrangeira
    createdAt: timestamp('created_at', { withTimezone: true})
        .notNull() //Não pode ser Nulo
        .defaultNow(), // preenche automaticamente com a data atual
})