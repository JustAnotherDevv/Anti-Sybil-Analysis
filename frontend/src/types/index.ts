export interface UserData {
  id: string;
  address: string;
  riskScore: number;
  behaviorScore: number;
  botProbability: number;
  transactionCount: number;
  avgTransactionValue: number;
  playTimeHours: number;
  uniqueInteractions: number;
  lastActive: string;
  status: 'High Risk' | 'Medium Risk' | 'Low Risk';
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface BehaviorMetric {
  category: string;
  score: number;
  maxScore: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  description: string;
  trend: number;
  icon: React.ReactNode;
}