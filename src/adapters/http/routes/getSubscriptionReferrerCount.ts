import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import z from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'

const subController = subscriptionFactory()
const getSubReferrerCount =
  subController.getSubscriberReferrerCount.bind(subController)

export const getSubscribersReferrerCount: FastifyPluginAsyncZod = async app => {
  app.get(
    '/subscribers/:subscriberId/ranking/referrer',
    {
      schema: {
        summary: 'get subscribers invites referrer count',
        description: 'id of an user',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          200: z.object({
            count: z.number(),
          }),
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    getSubReferrerCount
  )
}
