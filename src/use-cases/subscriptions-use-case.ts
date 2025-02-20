import { EmailAlreadyExist } from '../Exceptions/erros'
import type { redisRepository } from '../adapters/repositories/redisRepository'
import type { CRUDRepository, SubscriptionRequest } from '../domain/core'

export class SubscriptionsUseCase {
  constructor(
    private readonly crudRepository: CRUDRepository,
    private readonly redisRepository: redisRepository
  ) {}

  async Subscription({ name, email, referrerId }: SubscriptionRequest) {
    const doesUserExist = await this.crudRepository.get(email)

    if (!doesUserExist) {
      return await this.crudRepository.create({ name, email, referrerId })
    }
    return { id: doesUserExist.id }
  }

  async InviteLinkSum(referrer: string) {
    return await this.redisRepository.increaseRefScore(referrer)
  }

  async getSubscribersInviteClicks(subscriberId: string) {
    return await this.redisRepository.getSubscriptionCount(subscriberId)
  }

  async getSubscribersInviteReferralCount(subscriberId: string) {
    return await this.redisRepository.getSubscriberReferralCount(subscriberId)
  }

  async getSubscriberRankingPosition(subscriberId: string) {
    const position =
      await this.redisRepository.getSubscriberRankingPosition(subscriberId)
    return position
  }

  async getRanking() {
    const subscriberRankingObject = await this.redisRepository.getRanking()

    const subscriberRanking =
      await this.crudRepository.getSubscribersRankingName(
        subscriberRankingObject
      )
    return subscriberRanking
  }
}
