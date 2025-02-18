import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { env } from './env'
import { subscriptToEventRoute } from './routes/subscribeToEvent-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http:localhost:3322',
})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'nlw connect',
      version: '0.0.1',
      description: 'information about all REST APIs of NLW connect',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(subscriptToEventRoute)

app.listen({ port: env.PORT }).then(() => {
  try {
    console.log('server ready🚀')
  } catch (error) {
    console.error(error)
  }
})

console.log('hello world!')
