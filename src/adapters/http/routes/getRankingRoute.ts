import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import z from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'

const subController = subscriptionFactory()
const getRanking = subController.getRanking.bind(subController)

export const getRankingRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'show a ranking of users',
        tags: ['ranking'],
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                score: z.number(),
              })
            ),
          }),
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    getRanking
  )
}
