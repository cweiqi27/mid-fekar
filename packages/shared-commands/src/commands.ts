import type { Immutable, ObjectValues } from 'shared-types'

import type { ChatInputCommandInteraction } from './providers/discord.js'
import { pingCommand } from './ping.js'

export const COMMANDS_LOOKUP = {
  ping: pingCommand,
  // lol: pingCommand,
  // hmm: pingCommand,
} as const satisfies Record<string, CommandsObj>

export type CommandsLookup = typeof COMMANDS_LOOKUP
export type CommandsLookupKeys = keyof CommandsLookup
export type CommandsLookupValues = ObjectValues<CommandsLookup>

export type CommandsObj = Immutable<{
  data: SlashCommands
  execute: (interaction: ChatInputCommandInteraction) => void
}>

export type SlashCommands = {
  name: string
  type: 1
  description: string
}

export const isRecognizedCommand = (
  commandName: string,
): commandName is CommandsLookupKeys =>
  COMMANDS_LOOKUP[commandName as CommandsLookupKeys] !== undefined
