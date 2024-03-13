import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { users } from '../db/schema'

import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import jwt from 'jsonwebtoken'
import { env } from '~/env'

const generateJWTToken = (payload: object) => {
  const expireTime = 7 * 24 * 60 * 60
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expireTime,
  })
}

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newUser = await ctx.db
          .insert(users)
          .values(input)
          .returning({ userId: users.id })
          .onConflictDoNothing()
          .execute()

        // NOTE: User ID should be enough, but can add other things to the payload.
        const payload = {
          userId: newUser[0]?.userId,
        }

        console.log(payload);

        const token = generateJWTToken(payload)


      // NOTE: Maybe use a cookie serializer to do this, for now its fine.
        ctx.res.setHeader(
          'Set-Cookie',
          `riftToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
        )
      } catch (e) {
        // TODO:  We need better error handling
        console.log('Error while creating user', e)
        throw new TRPCError({
          message: e as string,
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),

  // A procedure to logout
})