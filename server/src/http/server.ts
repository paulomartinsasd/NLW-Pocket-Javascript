import fastify from 'fastify'
import {createGoal} from "../functions/create-goal";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import z from 'zod'
import {getWeedPendingGoals} from "../functions/get-weed-pending-goals";
import {createGoalCompletion} from "../functions/create-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.get('/pending-goals', async () => {
    const {  pendingGoals } = await getWeedPendingGoals()

    return { pendingGoals }
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.post('/goals', {
    schema: {
        body: z.object({
            title: z.string(),
            desiredWeeklyFrenquency: z.number().int().min(1).max(7),
        }),
    }
},
    async request => {
        const { title, desiredWeeklyFrenquency } = request.body
        await createGoal({
            title,
            desiredWeeklyFrenquency,
        })
    })

app.post('/completions', {
    schema: {
        body: z.object({
            goalId: z.string(),
        }),
    }
},
    async request => {
        const { goalId } = request.body

        await createGoalCompletion({
            goalId,
        })
    })

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
