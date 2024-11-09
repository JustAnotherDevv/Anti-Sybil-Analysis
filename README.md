# Anti-Sybil Dashboard

## Overview

## Features

## Setup

### Backend

- Create new Supabase project and fill out `.env` variables with your url and api key.

- Run SQL queries inside your supabase SQL editor to initialize it:

```SQL
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
```

- Run `npm i` inside `/backend` directory in order to install dependenies

- Run `npm run start` to run server

### Frontend
