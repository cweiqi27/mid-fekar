import type { CommandsLookupKeys, CommandsObj } from '@/types/commands.type.js'
import { pingCommand } from './ping.helper.js'

export const COMMANDS_LOOKUP = {
  ping: pingCommand,
  // lol: pingCommand,
  // hmm: pingCommand,
} as const satisfies Record<string, CommandsObj>

export const isRecognizedCommand = (
  commandName: string,
): commandName is CommandsLookupKeys =>
  COMMANDS_LOOKUP[commandName as CommandsLookupKeys] !== undefined
