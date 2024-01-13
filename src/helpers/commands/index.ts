import type {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from 'discord.js'
import { pipe } from 'fp-ts/lib/function.js'
import * as O from 'fp-ts/lib/Option.js'

import { logger } from '@/common/logger.js'
import { logAndReturn } from '@/common/utils.js'
import { client, events } from '@/providers/discord.js'
import { COMMANDS_LOOKUP, isRecognizedCommand } from './commands.helper.js'

export const interactionCreate = client.on(
  events.InteractionCreate,
  (interaction) => {
    logger.info(`Listening ${events.InteractionCreate}`)

    pipe(
      interaction,
      O.fromPredicate(isChatInputCommand),
      logAndReturn('isChatInputCommmand'),
      O.flatMap((cmd) =>
        pipe(cmd.commandName, O.fromPredicate(isRecognizedCommand)),
      ),
      logAndReturn('isRecognizedCommand'),
      O.match(
        () => {
          logger.error('wrong command')
        },
        (cmd) => COMMANDS_LOOKUP[cmd].execute(),
      ),
    )
  },
)

export const isChatInputCommand = (
  interaction: Interaction<CacheType>,
): interaction is ChatInputCommandInteraction<CacheType> =>
  interaction.isChatInputCommand()
