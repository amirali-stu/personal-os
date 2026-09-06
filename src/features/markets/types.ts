export type MarketType = "forex" | "gold" | "currency";

export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  type: MarketType;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  unit: string;
  updatedAt: number;
};
