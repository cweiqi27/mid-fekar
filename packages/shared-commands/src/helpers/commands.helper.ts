import type * as T from 'fp-ts/lib/Task.js'

import type {
  ApplicationCommandTypeValues,
  ChatInputCommandInteraction,
  InteractionResponse,
} from '@/providers/discord.js'
import { dictionaryCommand, pingCommand } from './slash-commands.helper.js'

import type { Immutable, ObjectValues } from '~shared-types'

export const COMMANDS_LOOKUP = {
  ping: pingCommand,
  dictionary: dictionaryCommand,
} as const satisfies Record<string, SlashCommandStruct>

export type CommandsLookup = typeof COMMANDS_LOOKUP
export type CommandsLookupKeys = keyof CommandsLookup
export type CommandsLookupValues = ObjectValues<CommandsLookup>

export type SlashCommandStruct = Immutable<{
  data: SlashCommands
  execute: (
    interaction: ChatInputCommandInteraction,
  ) => T.Task<Promise<InteractionResponse<boolean>>>
}>

export type SlashCommands = {
  name: string
  type: ApplicationCommandTypeValues
  description: string
}

export const isRecognizedCommand = (
  commandName: string,
): commandName is CommandsLookupKeys =>
  COMMANDS_LOOKUP[commandName as CommandsLookupKeys] !== undefined
