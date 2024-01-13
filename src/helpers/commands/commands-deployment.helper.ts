import { Routes } from 'discord.js'
import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as TE from 'fp-ts/lib/TaskEither.js'

import type { RegisterError } from '@/common/error.js'
import { env } from '@/common/env.js'
import { genericErrorExit } from '@/common/error.js'
import { logger } from '@/common/logger.js'
import { REST } from '@/providers/discord.js'
import { COMMANDS_LOOKUP } from './commands.helper.js'
import { pingCommand } from './ping.helper.js'

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN)
const commands = COMMANDS_LOOKUP

export const deployCommands = async () => {
  logger.info(
    `Started refreshing ${
      Object.keys(commands).length
    } application (/) commands.`,
  )

  logger.warn(`${JSON.stringify(pingCommand.data)}`)

  const data = await pipe(
    TE.tryCatch<RegisterError, unknown>(
      () =>
        rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
          body: [pingCommand.data],
        }),
      (e) => ({ type: 'RegisterError', error: E.toError(e) }),
    ),
    TE.match(flow(genericErrorExit), (dat) => dat),
  )()

  logger.info(`Successfully reloaded ${JSON.stringify(data)}`)
}
