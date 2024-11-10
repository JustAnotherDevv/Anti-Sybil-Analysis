# Anti-Sybil Dashboard

## Overview

### Usser Score

Implementation of tracking positive user score based on their on-chain:

### Anti-Sybil

Implementation of Anti-Sybil measures to combat airdrop farming, bots:

## Features

- Example Web3 game db ✅

- Mock data generation for users and transactions ✅

- Real-time new db record detection and score update ✅

- User positive activity score calculation

- User negative(possible sybil) score calculation

- Dashboard for data visualization ✅

## Setup

### Backend

- Run `npm i` inside `/backend` directory in order to install dependenies.

- Create new Supabase project and fill out `.env` variables with your url and api key.

- Run SQL queries inside your supabase SQL editor to initialize it:

```SQL
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
```

- Enable **Realtime** for every table in the Supabase UI(this is needed for transaction listener).

- Run `mockupGenerator` to generate initial mockup data for the players and transactions.

- Run `npm run start` to run transaction listener and score updater.

### Frontend

- Install dependencies with `npm i`.

- Fill out `.env` with your varaibles.

- Run web app with `npm run dev`.
