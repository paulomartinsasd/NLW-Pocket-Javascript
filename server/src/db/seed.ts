import {goalCompletions, goals} from "./schema";
import {client, db} from "./index";
import dayjs from "dayjs";

async function seed(){
    await db.delete(goalCompletions)
    await db.delete(goals)

    const result = await db.insert(goals).values([
        { title: "Acordar Cedo", desiredWeeklyFrenquency: 5 },
        { title: "Me Exercitar", desiredWeeklyFrenquency: 3 },
        { title: "Meditar", desiredWeeklyFrenquency: 1 },
    ]).returning()

    const startOfWeek = dayjs().startOf('week')

    await db.insert(goalCompletions).values([
        { goalId: result[0].id, createdAt: startOfWeek.toDate() }, //startOfWeek.toDate() diz que a meta foi completa no primeiro dia da semana atual
        { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() }, //startOfWeek.toDate() diz que a meta foi completa no segundo dia da semana atual
    ])
}

seed().finally(() => {
    client.end()
})