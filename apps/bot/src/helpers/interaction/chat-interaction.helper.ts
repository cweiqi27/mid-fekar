import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'

import type {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from '@/providers/discord.js'
import { logger } from '@/common/logger.js'

import {
  COMMANDS_LOOKUP,
  isRecognizedCommand,
} from '~shared-commands/dist/index.js'

export const chatInputInteractionCreate = (
  interaction: Interaction<CacheType>,
) => {
  const chatInputInteraction = pipe(interaction, isChatInputCommandInteraction)
  const recognizedChatCommand = pipe(
    chatInputInteraction,
    E.map(flow(isRecognizedChatInputCommand)),
  )

  const combinedOpts = pipe(
    E.Do,
    E.bind('chatInput', () => chatInputInteraction),
    E.bind('command', () => recognizedChatCommand),
  )

  return pipe(
    combinedOpts,
    E.bimap(
      (dat) => dat,
      ({ chatInput, command }) => {
        pipe(
          command,
          E.match(flow(notRecognizedCommandAction), (cmd) => {
            logger.info(`Executing command: ${cmd}`)
            return pipe(chatInput, COMMANDS_LOOKUP[cmd].execute)
          }),
        )
      },
    ),
  )
}

export const isChatInputCommand = (
  interaction: Interaction<CacheType>,
): interaction is ChatInputCommandInteraction<CacheType> =>
  interaction.isChatInputCommand()

const isChatInputCommandInteraction = flow(
  E.fromPredicate(isChatInputCommand, (dat) => dat),
)

const isRecognizedChatInputCommand = (
  cmd: ChatInputCommandInteraction<CacheType>,
) =>
  pipe(
    cmd.commandName,
    E.fromPredicate(isRecognizedCommand, (dat) => dat),
  )

const notRecognizedCommandAction = (cmd: string) => {
  pipe(`${cmd} is not a recognized command!`, logger.error)
}
