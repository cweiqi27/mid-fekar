export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A'

export type Suit = 'DIAMOND' | 'HEART' | 'CLUB' | 'SPADE'
export const SuitSymbol = {
  DIAMOND: '♦',
  HEART: '♥',
  CLUB: '♣',
  SPADE: '♠',
} as const satisfies Record<Suit, string>

export type Card<T extends Suit> = {
  rank: Rank
  suit: {
    symbol: (typeof SuitSymbol)[T]
    label: T
  }
}
