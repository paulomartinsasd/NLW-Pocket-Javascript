import z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(), //Vai garantir que exista um campo DATABASE_URL e que chega uma url
})

export const env = envSchema.parse(process.env)