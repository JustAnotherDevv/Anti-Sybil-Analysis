import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../types";
import { supabase } from "../utils/supabase";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "../components/StatsCard";

export function UserList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    avgTransactionsPerUser: 0,
    activeUsersLast24h: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .order("total_transactions", { ascending: false });

      if (playersError) {
        console.error("Error fetching players:", playersError);
        return;
      }

      // Fetch total transactions
      const { count: txCount, error: txError } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      if (txError) {
        console.error("Error fetching transactions:", txError);
        return;
      }

      // Calculate stats
      const totalUsers = playersData.length;
      const totalTransactions = txCount || 0;
      const avgTx =
        totalUsers > 0 ? Math.round(totalTransactions / totalUsers) : 0;

      setPlayers(playersData);
      setStats({
        totalUsers,
        totalTransactions,
        avgTransactionsPerUser: avgTx,
        activeUsersLast24h: Math.round(totalUsers * 0.7), // Mock value for demo
      });
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleUserClick = (address: string) => {
    navigate(`/user/${address}`);
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatsCard key={i} title="" value="" loading />
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-4" />
            ))}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
          />
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions.toLocaleString()}
          />
          <StatsCard
            title="Avg TX per User"
            value={stats.avgTransactionsPerUser.toLocaleString()}
          />
          <StatsCard
            title="Active Users (24h)"
            value={stats.activeUsersLast24h.toLocaleString()}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Game Players</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Click on a row to view detailed player stats
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleUserClick(player.wallet_address)}
                  >
                    <TableCell className="font-medium">
                      {player.username}
                    </TableCell>
                    <TableCell className="font-mono">
                      {player.wallet_address.slice(0, 6)}...
                      {player.wallet_address.slice(-4)}
                    </TableCell>
                    <TableCell>{player.level}</TableCell>
                    <TableCell className="text-right">
                      {player.total_transactions}
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
