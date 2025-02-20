import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import z from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'

const subController = subscriptionFactory()
const getSubClicks =
  subController.getSubscriptionInvitationClicks.bind(subController)

export const getSubscriptionInviteClicksRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/subscribers/:subscriberId/ranking/clicks',
      {
        schema: {
          summary: 'get subscribers invite clicks count',
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
      getSubClicks
    )
  }
