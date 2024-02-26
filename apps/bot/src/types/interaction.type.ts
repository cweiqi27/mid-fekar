import type { InteractionResponse } from 'discord.js'
import type { Task } from 'fp-ts/lib/Task.js'
import type * as E from 'fp-ts/lib/Either.js'

import type { CommandError } from '@/common/error.js'
import type { CacheType, Interaction } from '@/providers/discord.js'

export type InteractionInputType = E.Either<
  Interaction<CacheType>,
  E.Either<CommandError, Task<Promise<InteractionResponse<boolean>>>>
>
