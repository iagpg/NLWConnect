import type { Config } from 'drizzle-kit'
import { env } from './src/env'

export default {
  schema: './src/adapters/drizzle/schema/*',
  out: './src/adapters/drizzle/migrations',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  dialect: 'postgresql',
} satisfies Config
