import { z } from "zod";

export const balanceSchema = z.object({
  id: z.number(),
  credits: z.number(),
  user_id: z.number(),
});

export type balanceType = z.infer<typeof balanceSchema>

export const balanceArraySchema = z.array(balanceSchema)

export type BalancesArrayType = z.infer<typeof balanceArraySchema>

