import { eq, inArray } from 'drizzle-orm'
import {
  type CRUDRepository,
  type SubscriptionRequest,
  rankingInformation,
} from '../../domain/core'

import { subscriptions as subscriptionDomain } from '../../domain/core'
import { redis } from '../.redis/client'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'

export class CrudPrismaRepository implements CRUDRepository {
  async get(subId: string) {
    //return new subscriptions({})
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, subId))

    if (result.length > 0) {
      const subscriberFound = result[0]

      return new subscriptionDomain(
        subscriberFound.id,
        subscriberFound.name,
        subscriberFound.email,
        subscriberFound.createdAt
      )
    }
    return undefined
  }

  async create({ name, email, referrerId }: SubscriptionRequest) {
    const result = await db
      .insert(subscriptions)
      .values({
        email,
        name,
      })
      .returning()

    const subscriber = result[0]

    if (referrerId) {
      await redis.zincrby('referral:Ranking', 1, referrerId)
    }

    return {
      id: subscriber.id,
    }
  }

  async getSubscribersRankingName(
    t: Record<string, number>
  ): Promise<rankingInformation[]> {
    const subscribersInformation = await db
      .select()
      .from(subscriptions)
      .where(inArray(subscriptions.id, Object.keys(t)))

    const rankingNamesAndScore = subscribersInformation.map(subscriber => {
      return new rankingInformation(
        subscriber.id,
        subscriber.name,
        t[subscriber.id]
      )
    })
    return rankingNamesAndScore.sort((sub1, sub2) => {
      return sub2.score - sub1.score
    })
  }
}
