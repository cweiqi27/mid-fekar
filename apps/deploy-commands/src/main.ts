import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as TE from 'fp-ts/lib/TaskEither.js'
import { COMMANDS_LOOKUP } from 'shared-commands/dist/index.js'

import type { RegisterError } from '@/common/error.js'
import { env } from '@/common/env.js'
import { genericErrorExit } from '@/common/error.js'
import { logger } from '@/common/logger.js'
import { REST, Routes } from '@/providers/discord.js'

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN)
const commands = COMMANDS_LOOKUP

const deployCommands = async () => {
  logger.info(
    `Started refreshing ${
      Object.keys(commands).length
    } application (/) commands.`,
  )

  await pipe(
    TE.tryCatch<RegisterError, unknown>(
      () =>
        rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
          body: [commands.ping.data],
        }),
      (e) => ({ type: 'RegisterError', error: E.toError(e) }),
    ),
    TE.match(flow(genericErrorExit), (dat) => dat),
  )()

  logger.success(
    `Successfully reloaded ${
      Object.keys(commands).length
    } application (/) comands.`,
  )
}

deployCommands()
