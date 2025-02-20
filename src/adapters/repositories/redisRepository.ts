import type { CRUDRepository } from '../../domain/core'
import { redis } from '../.redis/client'

export class redisRepository {
  async increaseRefScore(subscriberId: string) {
    await redis.hincrby('referral:access-count', subscriberId, 1)
  }

  async getSubscriptionCount(subscriberId: string) {
    const count = await redis.hget('referral:access-count', subscriberId)
    return { count: count ? Number.parseInt(count) : 0 }
  }

  async getSubscriberReferralCount(subscriberId: string) {
    const count = await redis.zscore('referral:Ranking', subscriberId)
    return { count: count ? Number.parseInt(count) : 0 }
  }
  async getSubscriberRankingPosition(subscriberId: string) {
    const rank = await redis.zrevrank('referral:Ranking', subscriberId)

    if (rank === null) {
      return {
        position: null,
      }
    }
    return {
      position: rank + 1, // rank is a index so it begin with 0
    }
  }

  async getRanking() {
    const ranking = await redis.zrevrange(
      'referral:Ranking',
      0,
      2,
      'WITHSCORES'
    )
    const subscriberRankingAndScore: Record<string, number> = {}

    for (let i = 0; i < ranking.length; i += 2) {
      subscriberRankingAndScore[ranking[i]] = Number.parseInt(ranking[i + 1])
    }
    return subscriberRankingAndScore
  }
}
