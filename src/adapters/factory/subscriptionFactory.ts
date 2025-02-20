import { SubscriptionsUseCase } from '../../use-cases/subscriptions-use-case'
import { SubscriptionController } from '../http/controllers/subscription-controller'
import { CrudPrismaRepository } from '../repositories/PostgresRepository'
import { redisRepository } from '../repositories/redisRepository'

export function subscriptionFactory(): SubscriptionController {
  const crudPrismaRepo = new CrudPrismaRepository()
  const RedisRepository = new redisRepository()

  const subUseCase = new SubscriptionsUseCase(crudPrismaRepo, RedisRepository)
  return new SubscriptionController(subUseCase)
}
