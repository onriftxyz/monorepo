import { TRPCError, initTRPC } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from './db/client'
import { env } from '~/env'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

// type CreateContextOptions = Record<string, never>

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return {
    db,
    ..._opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

const isAuthenticated = t.middleware(({ ctx, next }) => {
  const riftToken = ctx.req.cookies.riftToken

  if (!riftToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated',
    })
  }

  type JwtPayload = {
    userId: number
  }

  let payload
  try {
    payload = jwt.verify(riftToken, env.JWT_SECRET) as JwtPayload
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      })
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while verifying token',
    })
  }

  return next({
    ctx: {
      userDbId: payload?.userId,
    },
  })
})

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthenticated)
