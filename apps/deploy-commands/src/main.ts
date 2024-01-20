import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as TE from 'fp-ts/lib/TaskEither.js'
import { COMMANDS_LOOKUP } from 'shared-commands/dist/index.js'

import type { LoginError, RegisterCommandsError } from '@/common/error.js'
import { env } from '@/common/env.js'
import { genericErrorExit } from '@/common/error.js'
import { logger } from '@/common/logger.js'
import { client, events, REST, Routes } from '@/providers/discord.js'
import { genericNormalExit } from './common/utils.js'

const rest = new REST().setToken(env.DISCORD_BOT_TOKEN)
const commands = COMMANDS_LOOKUP

client.once(events.ClientReady, (readyClient) =>
  logger.success(`${readyClient.user.tag} ready.`),
)

await pipe(
  TE.tryCatch<LoginError, string>(
    () => client.login(env.DISCORD_BOT_TOKEN),
    (e) => ({ type: 'LoginError', error: E.toError(e) }),
  ),
  TE.match(flow(genericErrorExit), () =>
    pipe('Login success.', logger.success),
  ),
)()

const deployCommands = async () => {
  logger.info(
    `Started refreshing ${
      Object.keys(commands).length
    } application (/) commands.`,
  )

  await pipe(
    TE.tryCatch<RegisterCommandsError, unknown>(
      () =>
        rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
          body: [commands.ping.data],
        }),
      (e) => ({ type: 'RegisterCommandsError', error: E.toError(e) }),
    ),
    TE.match(flow(genericErrorExit), (dat) => {
      pipe(
        `Successfully reloaded ${
          Object.keys(commands).length
        } application (/) comands.`,
        (msg) => `${msg}\n Data: ${JSON.stringify(dat)}`,
        logger.success,
      )
      genericNormalExit()
    }),
  )()
}

await deployCommands()
