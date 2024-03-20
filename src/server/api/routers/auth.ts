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

        if (newUser.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
          })
        }

        // NOTE: User ID should be enough, but can add other things to the payload.
        const payload = {
          userId: newUser[0]!.userId,
        }

        const token = generateJWTToken(payload)

        // NOTE: Maybe use a cookie serializer to do this, for now its fine.
        ctx.res.setHeader(
          'Set-Cookie',
          `riftToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
        )
      } catch (e) {
        console.log('Error while creating user', e)
        throw new TRPCError({
          message: e as string,
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),

  // TODO: A procedure to logout
})
