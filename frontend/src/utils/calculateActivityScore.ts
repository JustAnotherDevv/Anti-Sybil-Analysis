/**
 * Constants for score calculation
 */
const SCORE_WEIGHTS = {
  transactionVolume: 0.25,
  accountAge: 0.15,
  levelProgress: 0.2,
  transactionFrequency: 0.25,
  transactionPattern: 0.15,
};

const TIME_PERIODS = {
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 1000 * 60 * 60 * 24 * 7,
  MONTH: 1000 * 60 * 60 * 24 * 30,
};

/**
 * Calculate activity score for a user based on their profile and transaction history
 * @param {Object} player - Player data from the database
 * @param {Array} transactions - Array of user's transactions
 * @returns {Object} Activity score and detailed metrics
 */
async function calculateActivityScore(player, transactions) {
  const now = new Date();
  const playerTransactions = transactions.filter(
    (t) =>
      t.from_address === player.wallet_address ||
      t.to_address === player.wallet_address
  );

  // 1. Transaction Volume Score (0-100)
  const volumeScore = calculateTransactionVolumeScore(playerTransactions);

  // 2. Account Age Score (0-100)
  const accountAgeScore = calculateAccountAgeScore(player.created_at, now);

  // 3. Level Progress Score (0-100)
  const levelProgressScore = calculateLevelProgressScore(
    player.level,
    player.experience_points
  );

  // 4. Transaction Frequency Score (0-100)
  const frequencyScore = calculateTransactionFrequencyScore(
    playerTransactions,
    now
  );

  // 5. Transaction Pattern Score (0-100)
  const patternScore = calculateTransactionPatternScore(playerTransactions);

  // Calculate final weighted score
  const finalScore = (
    volumeScore * SCORE_WEIGHTS.transactionVolume +
    accountAgeScore * SCORE_WEIGHTS.accountAge +
    levelProgressScore * SCORE_WEIGHTS.levelProgress +
    frequencyScore * SCORE_WEIGHTS.transactionFrequency +
    patternScore * SCORE_WEIGHTS.transactionPattern
  ).toFixed(2);

  // Calculate risk factors and suspicious patterns
  const riskFactors = detectRiskFactors(player, playerTransactions);

  return {
    finalScore,
    metrics: {
      volumeScore,
      accountAgeScore,
      levelProgressScore,
      frequencyScore,
      patternScore,
    },
    riskFactors,
    lastUpdated: now,
  };
}

function calculateTransactionVolumeScore(transactions) {
  if (!transactions.length) return 0;

  const totalVolume = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );
  const averageVolume = totalVolume / transactions.length;

  // Score based on logarithmic scale to handle varying transaction sizes
  return Math.min(100, Math.log10(1 + averageVolume) * 20);
}

function calculateAccountAgeScore(createdAt, now) {
  const accountAge = now - new Date(createdAt);
  const ageInDays = accountAge / TIME_PERIODS.DAY;

  // Score increases with account age but plateaus after 6 months
  return Math.min(100, (ageInDays / 180) * 100);
}

function calculateLevelProgressScore(level, experiencePoints) {
  // Assuming level progression becomes harder at higher levels
  const baseScore = (level / 50) * 100; // Assuming max level is 50
  const expBonus = Math.min(20, (experiencePoints / 10000) * 20); // Bonus points for XP

  return Math.min(100, baseScore + expBonus);
}

function calculateTransactionFrequencyScore(transactions, now) {
  if (!transactions.length) return 0;

  // Calculate transactions per day over the last month
  const monthAgo = new Date(now - TIME_PERIODS.MONTH);
  const recentTransactions = transactions.filter(
    (t) => new Date(t.timestamp) > monthAgo
  );

  const transactionsPerDay = recentTransactions.length / 30;
  return Math.min(100, transactionsPerDay * 20); // 5 transactions per day for max score
}

function calculateTransactionPatternScore(transactions) {
  if (transactions.length < 2) return 50; // Neutral score for new accounts

  // Analyze transaction patterns
  let score = 50;
  const timestamps = transactions
    .map((t) => new Date(t.timestamp).getTime())
    .sort();

  // Check for regular intervals between transactions
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i - 1]);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const stdDev = calculateStandardDeviation(intervals);

  // Higher score for more natural variance in transaction timing
  const varianceScore = Math.min(50, (stdDev / avgInterval) * 100);

  return score + varianceScore;
}

function detectRiskFactors(player, transactions) {
  const riskFactors = [];

  // Check for suspicious patterns
  if (transactions.length > 0) {
    // 1. Rapid successive transactions
    const rapidTransactions = checkRapidTransactions(transactions);
    if (rapidTransactions)
      riskFactors.push("Unusual number of rapid transactions detected");

    // 2. Circular transaction patterns
    const circularPatterns = checkCircularPatterns(transactions);
    if (circularPatterns)
      riskFactors.push("Circular transaction patterns detected");

    // 3. Unusual level progression
    if (player.level > 10 && player.total_transactions < player.level * 2) {
      riskFactors.push(
        "Unusual level progression relative to transaction count"
      );
    }
  }

  return riskFactors;
}

// Utility functions
function calculateStandardDeviation(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
}

function checkRapidTransactions(transactions) {
  let rapidCount = 0;
  for (let i = 1; i < transactions.length; i++) {
    const timeDiff =
      new Date(transactions[i].timestamp) -
      new Date(transactions[i - 1].timestamp);
    if (timeDiff < TIME_PERIODS.HOUR) rapidCount++;
  }
  return rapidCount > transactions.length * 0.3; // If more than 30% are rapid
}

function checkCircularPatterns(transactions) {
  const addressPairs = new Set();
  let circularCount = 0;

  transactions.forEach((t) => {
    const pair = `${t.from_address}-${t.to_address}`;
    const reversePair = `${t.to_address}-${t.from_address}`;

    if (addressPairs.has(reversePair)) {
      circularCount++;
    }
    addressPairs.add(pair);
  });

  return circularCount > transactions.length * 0.1; // If more than 10% are circular
}

export default calculateActivityScore;
