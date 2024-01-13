import { logger } from '@/common/logger.js'

export const pingCommand = {
  data: {
    name: 'ping',
    type: 1,
    description: 'replies with pong',
  },
  execute: () => logger.success('lol'),
} as const
