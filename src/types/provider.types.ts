import type { Client } from '@/providers/discord.js'

export type DiscordClient = Client & {
  commands: Record<string, unknown>
}
