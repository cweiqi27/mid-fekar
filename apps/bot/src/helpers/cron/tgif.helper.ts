import Cron from 'croner'
import { pipe } from 'fp-ts/lib/function.js'
import * as O from 'fp-ts/lib/Option.js'

import type { Channel } from '@/providers/discord.js'
import { env } from '@/common/env.js'
import { logger } from '@/common/logger.js'
import { client, isTextBasedCommand } from '@/providers/discord.js'

export const announceTgif = Cron(
  '0 0 0 * * 5',
  async () => {
    const general = env.DIECORD_GENERAL_CHANNEL_ID

    const channel = await client.channels.fetch(general)
    pipe(
      channel,
      O.fromPredicate((ch): ch is Channel => ch !== undefined && ch !== null),
      O.match(
        () => logger.error('Channel does not exist'),
        async (ch) => {
          pipe(
            ch,
            O.fromPredicate(isTextBasedCommand),
            O.match(
              () => logger.error('Channel is not text based'),
              async (textChannel) => {
                await textChannel.send(`TGIF motherfkers`)
              },
            ),
          )
        },
      ),
    )
  },
  {
    timezone: 'Asia/Kuala_Lumpur',
  },
)
