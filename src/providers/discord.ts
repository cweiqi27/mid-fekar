import * as Discord from 'discord.js'

export const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.GuildMembers],
})

export const events = Discord.Events

export const REST = Discord.REST

export const Routes = Discord.Routes
