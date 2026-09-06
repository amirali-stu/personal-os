export type TradeSide = "buy" | "sell";

export type Trade = {
  id?: number;
  symbol: string;
  reason: string;
  side: TradeSide;
  result: number;
  score: number;
  date: string;
  createdAt: number;
};
