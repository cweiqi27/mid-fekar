import type { ChatInputCommandInteraction } from '@/providers/discord.js'
import type { CommandsObj } from '@/types/commands.type.js'

export const pingCommand = {
  data: {
    name: 'ping',
    type: 1,
    description: 'replies with pong',
  },
  execute: (interaction: ChatInputCommandInteraction) =>
    interaction.reply('pong'),
} as const satisfies CommandsObj
