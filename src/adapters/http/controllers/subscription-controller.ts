import type { FastifyReply, FastifyRequest } from 'fastify'
import { EmailAlreadyExist } from '../../../Exceptions/erros'
import type { SubscriptionRequest } from '../../../domain/core'
import { env } from '../../../env'
import type { SubscriptionsUseCase } from '../../../use-cases/subscriptions-use-case'

export class SubscriptionController {
  constructor(private readonly subscriptionUseCase: SubscriptionsUseCase) {}

  async createSub(
    request: FastifyRequest<{
      Body: SubscriptionRequest
    }>,
    reply: FastifyReply
  ) {
    const { name, email, referrerId } = request.body
    try {
      const result = await this.subscriptionUseCase.Subscription({
        name,
        email,
        referrerId,
      })

      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      }
    }
    return reply.status(500).send()
  }

  async accessInvite(
    request: FastifyRequest<{ Params: { subscriberId: string } }>,
    reply: FastifyReply
  ) {
    const { subscriberId } = request.params

    console.log(subscriberId)

    const webURL = new URL(env.WEB_URL)
    webURL.searchParams.set('referrer', subscriberId)
    await this.subscriptionUseCase.InviteLinkSum(subscriberId)

    return reply.redirect(webURL.toString(), 302)
  }

  async getSubscriptionInvitationClicks(
    request: FastifyRequest<{ Params: { subscriberId: string } }>,
    reply: FastifyReply
  ) {
    const { subscriberId } = request.params
    const count =
      await this.subscriptionUseCase.getSubscribersInviteClicks(subscriberId)
    return reply.status(200).send(count)
  }

  async getSubscriberReferrerCount(
    request: FastifyRequest<{ Params: { subscriberId: string } }>,
    reply: FastifyReply
  ) {
    const { subscriberId } = request.params
    return await this.subscriptionUseCase.getSubscribersInviteReferralCount(
      subscriberId
    )
  }

  async getSubscriberRankingPosition(
    request: FastifyRequest<{ Params: { subscriberId: string } }>,
    reply: FastifyReply
  ) {
    const { subscriberId } = request.params
    const position =
      await this.subscriptionUseCase.getSubscriberRankingPosition(subscriberId)
    return position
  }

  async getRanking(request: FastifyRequest, reply: FastifyReply) {
    const ranking = await this.subscriptionUseCase.getRanking()
    reply.status(200).send({ ranking: ranking })
  }
}
