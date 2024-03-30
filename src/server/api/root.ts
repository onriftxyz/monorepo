import { createTRPCRouter } from "~/server/api/trpc";

import { authRouter } from "~/server/api/routers/auth";
import { userRouter } from "~/server/api/routers/user";
import { productRouter } from "./routers/product";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
