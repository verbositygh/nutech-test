import { z } from "zod";
import { Prisma } from "@prisma/client"

export default z.object({
  id: z.optional(z.string()),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>;
