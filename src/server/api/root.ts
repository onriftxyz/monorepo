import { createTRPCRouter } from "~/server/api/trpc";

import { authRouter } from "~/server/api/routers/auth";
import { userRouter } from "~/server/api/routers/user";
import { productRouter } from "./routers/product";
import { uploadRouter } from "./routers/upload";
import { paymentRouter } from "./routers/payment";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  user: userRouter,
  upload: uploadRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
