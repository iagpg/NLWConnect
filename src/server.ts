import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'

import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
// apis routes
import { accessInviteLinkRoute } from './adapters/http/routes/access-invite-link-route'
import { getRankingRoute } from './adapters/http/routes/getRankingRoute'
import { subscriberRankingPositionRoute } from './adapters/http/routes/getSubscriberRankingPosition'
import { getSubscriptionInviteClicksRoute } from './adapters/http/routes/getSubscriptionInviteClicks-route'
import { getSubscribersReferrerCount } from './adapters/http/routes/getSubscriptionReferrerCount'
import { subscriptToEventRoute } from './adapters/http/routes/subscribeToEvent-route'
// enviroment
import { env } from './env'

import 'zod-openapi/extend'

import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
} from 'fastify-zod-openapi'

import type { ZodOpenApiVersion } from 'zod-openapi'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyZodOpenApiPlugin)

app.register(fastifyCors, {
  origin: 'http://localhost:3322',
})
// SWAGGER CONFIG
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NLW connect',
      version: '0.0.1',
      description: 'information about all REST APIs of NLW connect',
    },
    openapi: '3.0.3' satisfies ZodOpenApiVersion,
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
})
//SWAGGER UI
app.register(fastifySwaggerUi, {
  routePrefix: env.SWAGGER_PREFIX,
})
//APIS
app.register(subscriptToEventRoute)
app.register(accessInviteLinkRoute)
app.register(getSubscriptionInviteClicksRoute)
app.register(getSubscribersReferrerCount)
app.register(subscriberRankingPositionRoute)
app.register(getRankingRoute)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app
  .listen({ port: env.PORT })
  .then(() => {
    console.log('running at port', env.PORT)
    console.log(
      `to view all the information about APIs go localhost:${env.PORT}${env.SWAGGER_PREFIX}`
    )

    console.log('server ready! 🚀')
  })
  .catch(err => {
    if (err) console.error(err)
  })
