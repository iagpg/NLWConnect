export class subscriptions {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public create_at: Date
  ) {}
}

export class rankingInformation {
  constructor(
    public id: string,
    public name: string,
    public score: number
  ) {}
}

export interface CRUDRepository {
  get: (email: string) => Promise<subscriptions | undefined>
  create: ({
    name,
    email,
    referrerId,
  }: SubscriptionRequest) => Promise<{ id: string }>

  getSubscribersRankingName: (
    t: Record<string, number>
  ) => Promise<rankingInformation[]>
}

export interface SubscriptionRequest {
  name: string
  email: string
  referrerId?: string
}

export interface RedixRepository {
  increaseRefScore: (subscriberId: string) => Promise<void>
}
