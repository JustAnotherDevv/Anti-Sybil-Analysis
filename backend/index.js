import { createClient } from "@supabase/supabase-js";
import { ethers, JsonRpcApiProvider } from "ethers";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function checkTables() {
  //   const { error: contractError } = await supabase
  //     .from("contracts")
  //     .select("id")
  //     .limit(1);

  const { error: playersError } = await supabase
    .from("players")
    .select("id")
    .limit(1);

  const { error: txError } = await supabase
    .from("transactions")
    .select("id")
    .limit(1);

  if (playersError || txError) {
    console.log("Tables not found. Run this in Supabase SQL:");
    console.log(`
      CREATE TABLE IF NOT EXISTS public.players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR NOT NULL UNIQUE,
        username VARCHAR NOT NULL,
        level INTEGER DEFAULT 1,
        experience_points INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );

      CREATE TABLE IF NOT EXISTS public.transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_address VARCHAR NOT NULL,
        to_address VARCHAR NOT NULL,
        amount DECIMAL NOT NULL,
        transaction_type VARCHAR NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
    `);
    throw new Error("Create required tables first");
  }
}

async function generatePlayers(count) {
  const players = [];

  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();

    const player = {
      wallet_address: wallet.address,
      username: faker.internet.userName(),
      level: faker.number.int({ min: 1, max: 100 }),
      experience_points: faker.number.int({ min: 0, max: 10000 }),
    };

    players.push(player);
  }

  const { error } = await supabase.from("players").insert(players);

  if (error) {
    console.error("Error inserting players:", error);
    throw error;
  }

  return players;
}

async function generateTransactions(players, transactionsPerPlayer) {
  const transactions = [];
  const transactionTypes = [
    "ITEM_PURCHASE",
    "REWARD_CLAIM",
    "TOKEN_TRANSFER",
    "NFT_TRADE",
  ];

  for (const player of players) {
    for (let i = 0; i < transactionsPerPlayer; i++) {
      const randomRecipient =
        players[Math.floor(Math.random() * players.length)];

      const transaction = {
        from_address: player.wallet_address,
        to_address: randomRecipient.wallet_address,
        amount: parseFloat(faker.finance.amount(0.001, 10, 6)),
        transaction_type:
          transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
        timestamp: faker.date.recent({ days: 30 }),
      };

      transactions.push(transaction);
    }
  }

  const { error } = await supabase.from("transactions").insert(transactions);

  if (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function generateMockData() {
  try {
    console.log("Checking database tables ");
    await checkTables();

    console.log("Generating players");
    const players = await generatePlayers(100);

    console.log("Generating transactions");
    await generateTransactions(players, 5);

    console.log("Mock data done");
  } catch (error) {
    console.error("Error generating mock: ", error);
  }
}

generateMockData();
// main();
