import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Player, Transaction } from "../types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/utils/supabase";

interface UserStats {
  totalTransactions: number;
  totalVolume: number;
  avgTransactionAmount: number;
  mostCommonType: string;
}

export function UserDetails() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!address) return;

      // Fetch player details
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("wallet_address", address)
        .single();

      if (playerError) {
        console.error("Error fetching player:", playerError);
        return;
      }

      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .or(`from_address.eq.${address},to_address.eq.${address}`)
        .order("timestamp", { ascending: false });

      if (txError) {
        console.error("Error fetching transactions:", txError);
        return;
      }

      // Calculate stats
      const totalVolume = txData.reduce((sum, tx) => sum + tx.amount, 0);
      const avgAmount = totalVolume / txData.length;
      const typeCount = txData.reduce((acc, tx) => {
        acc[tx.transaction_type] = (acc[tx.transaction_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommonType = Object.entries(typeCount)
        .sort((a, b) => b[1] - a[1])[0][0]
        .replace("_", " ");

      setPlayer(playerData);
      setTransactions(txData);
      setStats({
        totalTransactions: txData.length,
        totalVolume,
        avgTransactionAmount: avgAmount,
        mostCommonType,
      });
      setLoading(false);
    }

    fetchUserData();
  }, [address]);

  if (loading || !player || !stats) {
    return (
      <div className="container max-w-5xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatsCard key={i} title="" value="" loading />
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-5xl mx-auto p-4 space-y-6"
      >
        <Button variant="outline" onClick={() => navigate("/")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Players
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions.toLocaleString()}
          />
          <StatsCard
            title="Total Volume"
            value={stats.totalVolume.toFixed(2)}
          />
          <StatsCard
            title="Avg TX Amount"
            value={stats.avgTransactionAmount.toFixed(2)}
          />
          <StatsCard title="Most Common TX" value={stats.mostCommonType} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Player Details</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="text-lg font-medium">{player.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Address</p>
                <p className="text-lg font-mono break-all">
                  {player.wallet_address}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg font-medium">{player.level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Experience Points
                </p>
                <p className="text-lg font-medium">
                  {player.experience_points}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>All transactions for this player</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell>
                      {tx.transaction_type.replace("_", " ")}
                    </TableCell>
                    <TableCell className="font-mono">
                      {tx.from_address.slice(0, 6)}...
                      {tx.from_address.slice(-4)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {tx.to_address.slice(0, 6)}...{tx.to_address.slice(-4)}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.amount.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
