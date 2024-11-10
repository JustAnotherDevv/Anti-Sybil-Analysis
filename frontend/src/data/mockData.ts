import { UserData, TimeSeriesData, BehaviorMetric } from '@/types';

export const mockUsers: UserData[] = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${i + 1}`,
  address: `0x${Math.random().toString(16).slice(2, 42)}`,
  riskScore: Math.random() * 100,
  behaviorScore: Math.random() * 100,
  botProbability: Math.random() * 100,
  transactionCount: Math.floor(Math.random() * 1000),
  avgTransactionValue: Math.random() * 10,
  playTimeHours: Math.random() * 200,
  uniqueInteractions: Math.floor(Math.random() * 500),
  lastActive: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  status: Math.random() > 0.7 ? 'High Risk' : Math.random() > 0.4 ? 'Medium Risk' : 'Low Risk',
}));

export const timeSeriesData: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.random() * 100,
}));

export const behaviorMetrics: BehaviorMetric[] = [
  { category: 'Transaction Pattern', score: 85, maxScore: 100 },
  { category: 'Play Time Distribution', score: 72, maxScore: 100 },
  { category: 'Social Interaction', score: 93, maxScore: 100 },
  { category: 'Resource Usage', score: 68, maxScore: 100 },
  { category: 'Account Age', score: 95, maxScore: 100 },
];