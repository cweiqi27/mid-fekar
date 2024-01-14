import { pipe } from 'fp-ts/lib/function.js'
import * as O from 'fp-ts/lib/Option.js'

import type {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from '@/providers/discord.js'
import { logger } from '@/common/logger.js'
import { logAndReturn } from '@/common/utils.js'
import { client, events } from '@/providers/discord.js'
import { COMMANDS_LOOKUP, isRecognizedCommand } from './commands.helper.js'

export const interactionCreate = client.on(
  events.InteractionCreate,
  (interaction) => {
    logger.info(`Listening ${events.InteractionCreate}`)

    const chatInputInteraction = pipe(
      interaction,
      O.fromPredicate(isChatInputCommand),
    )

    const isCommand = pipe(
      chatInputInteraction,
      O.flatMap((cmd) =>
        pipe(cmd.commandName, O.fromPredicate(isRecognizedCommand)),
      ),
    )

    const combinedOpts = pipe(
      O.Do,
      O.bind('chatInput', () => chatInputInteraction),
      O.bind('commandKeys', () => isCommand),
    )

    pipe(
      combinedOpts,
      logAndReturn('isRecognizedCommand'),
      O.match(
        () => {
          logger.error('Wrong command')
        },
        ({ chatInput, commandKeys }) =>
          pipe(chatInput, COMMANDS_LOOKUP[commandKeys].execute),
      ),
    )
  },
)

export const isChatInputCommand = (
  interaction: Interaction<CacheType>,
): interaction is ChatInputCommandInteraction<CacheType> =>
  interaction.isChatInputCommand()
