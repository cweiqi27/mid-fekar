import * as Discord from 'discord.js'

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

export type Channel = Discord.Channel

export type GuildBasedChannel = Discord.GuildBasedChannel
export type TextBasedChannel = Discord.TextBasedChannel

export const isTextBasedCommand = (
  channel: Discord.Channel,
): channel is GuildBasedChannel & TextBasedChannel => channel.isTextBased()
