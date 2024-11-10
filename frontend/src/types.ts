export interface Player {
  id: string;
  wallet_address: string;
  username: string;
  level: number;
  experience_points: number;
  total_transactions: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  from_address: string;
  to_address: string;
  amount: number;
  transaction_type:
    | "ITEM_PURCHASE"
    | "REWARD_CLAIM"
    | "TOKEN_TRANSFER"
    | "NFT_TRADE";
  timestamp: string;
}
