import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkTables() {
  const { error: playersError } = await supabase
    .from("players")
    .select("id")
    .limit(1);

  const { error: txError } = await supabase
    .from("transactions")
    .select("id")
    .limit(1);

  if (playersError || txError) {
    console.log(
      "Tables not found. Please create them using the following SQL:"
    );
    console.log(`
      CREATE TABLE IF NOT EXISTS public.players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR NOT NULL UNIQUE,
        username VARCHAR NOT NULL,
        level INTEGER DEFAULT 1,
        experience_points INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        total_transactions INTEGER DEFAULT 0
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
    throw new Error("Please create the required tables first");
  }
}

async function generatePlayers(count) {
  console.log(`\n🎮 Generating ${count} players...`);
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

  console.log(`✅ Generated ${count} players`);
  return players;
}

async function generateTransactions(players) {
  console.log(`\n💸 Generating random transactions for each player...`);
  const transactionTypes = [
    "ITEM_PURCHASE",
    "REWARD_CLAIM",
    "TOKEN_TRANSFER",
    "NFT_TRADE",
  ];

  for (const player of players) {
    const txCount = faker.number.int({ min: 5, max: 25 });
    console.log(`Generating ${txCount} transactions for ${player.username}`);

    for (let i = 0; i < txCount; i++) {
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

      const { error } = await supabase.from("transactions").insert(transaction);

      if (error) {
        console.error("Error inserting transaction:", error);
        continue;
      }

      console.log(
        `✅ Transaction: ${transaction.from_address.slice(
          0,
          6
        )}...${transaction.from_address.slice(
          -4
        )} -> ${transaction.to_address.slice(
          0,
          6
        )}...${transaction.to_address.slice(-4)} | ${
          transaction.transaction_type
        } | ${transaction.amount}`
      );

      await delay(500);
    }
  }
}

async function generateMockData() {
  try {
    console.log("🚀 Starting mock data generation...");
    await checkTables();

    const players = await generatePlayers(10);
    await generateTransactions(players);

    console.log("\n✨ Mock data generation completed successfully!");
  } catch (error) {
    console.error("❌ Error generating mock data:", error);
  }
}

generateMockData();
