import { z } from "zod";
import { Prisma } from "@prisma/client"

export const GoodFormValidation = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  buyingPrice: z.string().or(z.number()),
  sellingPrice: z.string().or(z.number()),
  stock: z.string().or(z.number()),
  image: z.string(),
})

export default z.object({
  id: z.optional(z.string().min(5)),
  name: z.string().min(3),
  buyingPrice: z.number(),
  sellingPrice: z.number(),
  stock: z.number().int(),
  image: z.string().min(10),
  userId: z.string(),
}) satisfies z.Schema<Prisma.GoodUncheckedCreateInput>;

