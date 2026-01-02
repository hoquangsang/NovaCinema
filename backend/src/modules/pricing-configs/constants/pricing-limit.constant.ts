export const PRICING_LIMITS = {
  BASE_PRICE: {
    MIN: 50_000,
    MAX: 100_000,
  },

  PRICING_MODIFIER: {
    MIN_DELTA: 0,
    MAX_DELTA: 300_000,
  },

  TOTAL_PRICE: {
    MIN: 50_000,
    MAX: 400_000,
  },
} as const;
