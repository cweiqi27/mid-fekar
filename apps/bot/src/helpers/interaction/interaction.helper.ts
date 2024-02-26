import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'
import * as TE from 'fp-ts/lib/TaskEither.js'

import type { InteractionInputType } from '@/types/interaction.type.js'
import { logger } from '@/common/logger.js'
import { client, events } from '@/providers/discord.js'
import { chatInputInteractionCreate } from './chat-interaction.helper.js'

export const interactionCreate = client.on(
  events.InteractionCreate,
  async (interaction) => {
    logger.info(`Listening ${events.InteractionCreate}`)

    const chatInput = chatInputInteractionCreate(interaction)
    await pipe(chatInput, interactionInputEnd)
  },
)

const interactionInputEnd = async (
  input: InteractionInputType,
): Promise<void> => {
  const mapInput = pipe(
    input,
    E.flatMap((dat) =>
      pipe(
        dat,
        E.mapLeft((e) => pipe(`[${e.type}] ${e.error.message}`, logger.error)),
      ),
    ),
    E.getOrElseW(() => {
      throw Error('Interaction invalid.')
    }),
  )

  const res = await TE.tryCatch(
    () => mapInput(),
    (e) => E.toError(e),
  )()

  if (E.isLeft(res)) {
    logger.error(res.left.message)
  } else {
    await res.right
    logger.success('Command execution success.')
  }
}

// const interactionInputFlow =
//   (
//     inputInteractionCreate: (
//       interaction: Interaction<CacheType>,
//     ) => InteractionInputType,
//   ) =>
//   (input: InteractionInputType) =>
//     pipe(
//       input,
//       E.mapLeft((interaction) => {
//         const interactionCreate = inputInteractionCreate(interaction)
//         const lol = pipe(
//           E.Do,
//           E.bind('left', () => E.isLeft(interactionCreate)),
//         )
//       }),
//       E.matchW(
//         (interaction) => interaction,
//         (a) => a,
//       ),
//       // E.fromPredicate(
//       //   (a) => E.isRight(a),
//       //   (b) => pipe(b, E.swap),
//       // ),
//       // E.flattenW,
//     )
