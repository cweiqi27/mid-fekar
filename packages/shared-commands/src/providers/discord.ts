import * as Discord from 'discord.js'

import type { ObjectValues } from '~shared-types/index.js'

export const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.GuildMembers],
})

export const events = Discord.Events

export const REST = Discord.REST

export const Routes = Discord.Routes

export type ChatInputCommandInteraction<Cached extends CacheType = CacheType> =
  Discord.ChatInputCommandInteraction<Cached>

export type Client = Discord.Client

export type CacheType = Discord.CacheType

export type Interaction<Cached extends CacheType = CacheType> =
  Discord.Interaction<Cached>

export const APPLICATION_COMMAND_TYPE = {
  ChatInput: Discord.ApplicationCommandType.ChatInput,
  User: Discord.ApplicationCommandType.User,
  Message: Discord.ApplicationCommandType.Message,
} as const

export type ApplicationCommandType = typeof APPLICATION_COMMAND_TYPE
export type ApplicationCommandTypeKeys = keyof ApplicationCommandType
export type ApplicationCommandTypeValues = ObjectValues<ApplicationCommandType>

export type InteractionResponse<T extends boolean> =
  Discord.InteractionResponse<T>
