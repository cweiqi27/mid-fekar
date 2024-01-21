import type {
  ApplicationCommandTypeValues,
  ChatInputCommandInteraction,
} from './providers/discord.js'
import { dictionaryCommand, pingCommand } from './slash-commands.js'

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
  execute: (interaction: ChatInputCommandInteraction) => void
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
