import Cron from 'croner'
import { differenceInDays } from 'date-fns/fp'
import { pipe } from 'fp-ts/lib/function.js'
import * as O from 'fp-ts/lib/Option.js'

import type { Channel } from '@/providers/discord.js'
import { env } from '@/common/env.js'
import { logger } from '@/common/logger.js'
import { client, isTextBasedCommand } from '@/providers/discord.js'

export const remindDbd = new Cron(
  '0 7 * * *',
  async () => {
    const general = env.DIECORD_GENERAL_CHANNEL_ID
    const LAST_DBD_DATE = new Date('2024-01-10T00:00:00+08:00')
    const daysSinceDbd = pipe(new Date(), differenceInDays(LAST_DBD_DATE))

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
                await textChannel.send(
                  `${daysSinceDbd} days since 4 man dbd dream :( `,
                )
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
