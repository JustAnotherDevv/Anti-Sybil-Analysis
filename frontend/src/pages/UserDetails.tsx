import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Player, Transaction } from "../types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle } from "lucide-react";
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
import calculateActivityScore from "@/utils/calculateActivityScore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ActivityMetricsRadar } from "@/components/ActivityMetricsRadar";

interface UserStats {
  totalTransactions: number;
  totalVolume: number;
  avgTransactionAmount: number;
  mostCommonType: string;
}

interface ActivityScore {
  total_score: number;
  transaction_score: number;
  volume_score: number;
  frequency_score: number;
  age_score: number;
  active_days: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  risk_factors: string[];
  human_probability: number;
  unique_interactions_count: number;
  circular_transactions_count: number;
  first_tx_date: string;
  last_tx_date: string;
  calculated_at: string;
}

export function UserDetails() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activityScore, setActivityScore] = useState<ActivityScore | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!address) return;

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("wallet_address", address)
        .single();

      if (playerError) {
        console.error("Error fetching player:", playerError);
        return;
      }

      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .or(`from_address.eq.${address},to_address.eq.${address}`)
        .order("timestamp", { ascending: false });

      if (txError) {
        console.error("Error fetching transactions:", txError);
        return;
      }

      const { data: scoreData, error: scoreError } = await supabase
        .from("activity_scores")
        .select("*")
        .eq("wallet_address", address)
        .single();

      if (scoreError) {
        console.error("Error fetching activity score:", scoreError);
        return;
      }

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
      setActivityScore(scoreData);
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

  if (loading || !player || !stats || !activityScore) {
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

  function getRiskLevelColor(level: string) {
    switch (level) {
      case "HIGH":
        return "text-red-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "LOW":
        return "text-green-500";
      default:
        return "";
    }
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

        {/* Activity Score Overview */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Activity Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <StatsCard
                  title="Overall Activity Score"
                  value={`${activityScore.finalScore}%`}
                  description="Based on multiple metrics"
                  className="h-full"
                />
              </div>
              <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Volume Score"
                  value={`${activityScore.metrics.volumeScore.toFixed(1)}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Account Age"
                  value={`${activityScore.metrics.accountAgeScore.toFixed(1)}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Level Progress"
                  value={`${activityScore.metrics.levelProgressScore.toFixed(
                    1
                  )}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Activity Pattern"
                  value={`${activityScore.metrics.patternScore.toFixed(1)}%`}
                  className="h-full"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Risk Factors */}
        {/* {activityScore.riskFactors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Risk Factors Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {activityScore.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )} */}

        <Card>
          <CardHeader>
            <CardTitle>Activity Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <StatsCard
                  title="Overall Activity Score"
                  value={`${activityScore.total_score.toFixed(1)}%`}
                  description={`Risk Level: ${activityScore.risk_level}`}
                  className={`h-full ${getRiskLevelColor(
                    activityScore.risk_level
                  )}`}
                />
              </div>
              <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  title="Transaction Score"
                  value={`${activityScore.transaction_score.toFixed(1)}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Volume Score"
                  value={`${activityScore.volume_score.toFixed(1)}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Frequency Score"
                  value={`${activityScore.frequency_score.toFixed(1)}%`}
                  className="h-full"
                />
                <StatsCard
                  title="Age Score"
                  value={`${activityScore.age_score.toFixed(1)}%`}
                  className="h-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <ActivityMetricsRadar activityScore={activityScore} />

        {/* Sybil Detection Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Sybil Detection Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Human Probability"
                value={`${activityScore.human_probability}%`}
                className="h-full"
              />
              <StatsCard
                title="Unique Interactions"
                value={activityScore.unique_interactions_count.toString()}
                className="h-full"
              />
              <StatsCard
                title="Circular Transactions"
                value={activityScore.circular_transactions_count.toString()}
                className="h-full"
              />
              <StatsCard
                title="Active Days"
                value={activityScore.active_days.toString()}
                className="h-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        {activityScore.risk_factors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Risk Factors Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {activityScore.risk_factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
