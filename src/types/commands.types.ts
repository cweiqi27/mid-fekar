import type { COMMANDS_LOOKUP } from '@/helpers/commands/commands.helper.js'
import type { Immutable, ObjectValues } from './utils.types.js'

export type CommandsLookup = typeof COMMANDS_LOOKUP
export type CommandsLookupKeys = keyof CommandsLookup
export type CommandsLookupValues = ObjectValues<CommandsLookup>

export type CommandsObj = Immutable<{
  data: SlashCommands
  execute: () => void
}>

export type SlashCommands = {
  name: string
  type: 1
  description: string
}
