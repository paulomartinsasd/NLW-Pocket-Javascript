import dayjs from "dayjs";
import {db} from "../db";
import {goalCompletions, goals} from "../db/schema";
import {and, count, eq, gte, lte, sql} from "drizzle-orm";

export async function getWeedPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeekLyFrequency: goals.desiredWeeklyFrenquency,
            createdAt: goals.createdAt,
        })
            .from(goals)
            .where(lte(goals.createdAt, lastDayOfWeek))
    )

    const goalCompletionCounts = db.$with('goal_completion_counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        })
            .from(goalCompletions)
            .where(and(
                gte(goalCompletions.createdAt, firstDayOfWeek),
                lte(goalCompletions.createdAt, lastDayOfWeek)
            ))
            .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
            id: goalsCreatedUpToWeek.id,
            tile: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeekLyFrequency,
            ccompletionCount: sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith( Number ), //mapWith converte o resultado de COALESCE para número
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(
            goalCompletionCounts,
            eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
        )

    return {
        pendingGoals: { pendingGoals }
    }

}