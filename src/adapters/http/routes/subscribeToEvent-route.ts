import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import { z } from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'
const subController = subscriptionFactory()
const subUseCase = subController.createSub.bind(subController)

export const subscriptToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'subscribes a new user to the event',
        tags: ['subscription'],
        body: z.object({
          name: z.string().openapi({
            example: 'johnDoe',
          }),

          email: z.string().email(),
          referrerId: z
            .string()
            .nullish()
            .openapi({ description: 'id of user that will be rewarded' }),
        }),

        response: {
          201: z.object({
            id: z.string().openapi({
              description: 'user was created',
              example: 'userid123',
            }),
          }),
          200: z.object({
            id: z.string().openapi({
              description: 'returning user id',
              example: 'userid123',
            }),
          }),
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    subUseCase
  )
}
