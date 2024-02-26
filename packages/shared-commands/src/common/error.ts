export const genericErrorInteractionReply =
  'Oops! Something went wrong!' as const

export type JSONParseError = { type: 'JSONError'; error: Error }
export type SchemaError = { type: 'SchemaError'; error: Error }
