import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as TE from 'fp-ts/lib/TaskEither.js'

import type { LoginError } from './common/error.js'
import { env } from './common/env.js'
import { genericErrorExit } from './common/error.js'
import { logger } from './common/logger.js'
import { deployCommands } from './helpers/commands/deployment.helper.js'
import { interactionCreate } from './helpers/commands/index.js'
import { client, events } from './providers/discord.js'

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

await deployCommands()

interactionCreate
