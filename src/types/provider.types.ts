import type { Client } from 'discord.js'

export type DiscordClient = Client & {
  commands: Record<string, unknown>
}
