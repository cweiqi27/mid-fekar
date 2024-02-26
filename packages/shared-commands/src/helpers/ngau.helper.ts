import { pipe } from 'fp-ts/lib/function.js'
import * as T from 'fp-ts/lib/Task.js'

import type { ChatInputCommandInteraction } from '@/providers/discord.js'
import type { SlashCommandStruct } from './commands.helper.js'
import { APPLICATION_COMMAND_TYPE } from '@/providers/discord.js'

export const ngauCommand = {
  data: {
    name: 'ngau',
    type: APPLICATION_COMMAND_TYPE.ChatInput,
    description: 'Ping bot',
  },
  execute: (interaction: ChatInputCommandInteraction) =>
    pipe(interaction.reply('pong'), T.of),
} as const satisfies SlashCommandStruct
