import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import z from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'

const subController = subscriptionFactory()
const subRankingPosition =
  subController.getSubscriberRankingPosition.bind(subController)

export const subscriberRankingPositionRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/subscriber/:subscriberId/ranking/position',
      {
        schema: {
          summary: 'show a ranking of users',
          tags: ['ranking'],
          params: z.object({
            subscriberId: z.string(),
          }),
          response: {
            200: z.object({
              position: z.number().nullable(),
            }),
          },
        } satisfies FastifyZodOpenApiSchema,
      },
      subRankingPosition
    )
  }
