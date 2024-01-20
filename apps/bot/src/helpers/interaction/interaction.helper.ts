import { pipe } from 'fp-ts/lib/function.js'

import type {
  CacheType,
  ChatInputCommandInteraction,
  Interaction,
} from '@/providers/discord.js'
import { logger } from '@/common/logger.js'
import { client, events } from '@/providers/discord.js'
import { chatInputInteractionCreate } from './chat-interaction.helper.js'

export const interactionCreate = client.on(
  events.InteractionCreate,
  (interaction) => {
    logger.info(`Listening ${events.InteractionCreate}`)

    pipe(interaction, chatInputInteractionCreate)
  },
)

export const isChatInputCommand = (
  interaction: Interaction<CacheType>,
): interaction is ChatInputCommandInteraction<CacheType> =>
  interaction.isChatInputCommand()
