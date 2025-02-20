import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import z from 'zod'
import { subscriptionFactory } from '../../factory/subscriptionFactory'

const subController = subscriptionFactory()
const subInvitationUseCase = subController.accessInvite.bind(subController)

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberId',
    {
      schema: {
        summary: 'access invite link and redirects user',
        description: 'id of an user',
        tags: ['referral'],
        params: z.object({
          subscriberId: z.string(),
        }),
        response: {
          302: z.null(),
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    subInvitationUseCase
  )
}
