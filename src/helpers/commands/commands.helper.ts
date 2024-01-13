import type { CommandsLookupKeys, CommandsObj } from '@/types/commands.types.js'
import { pingCommand } from './ping.helper.js'

export const COMMANDS_LOOKUP = {
  ping: pingCommand,
  // lol: {
  //   execute: () => logger.success('ere'),
  // },
} as const satisfies Record<string, CommandsObj>

export const isRecognizedCommand = (
  commandName: string,
): commandName is CommandsLookupKeys =>
  COMMANDS_LOOKUP[commandName as CommandsLookupKeys] !== undefined
