// lib/prioritizer.ts

import { winsorize, calculateQuantile } from "./statistics";

interface DataRow {
  [key: string]: number | string;
}

interface SummaryStats {
  Mean: number;
  Std_Dev: number;
  Weight: number;
  "33%ile_Value": number;
  "67%ile_Value": number;
}

export function calculatePriorityScore(
  data: DataRow[],
  kpiColumns: string[],
  weights: { [key: string]: number },
): { 
  resultData: DataRow[]; 
  summaryData: ({ index: string } & SummaryStats)[] 
} {
  const kpiData = data.map((row) =>
    Object.fromEntries(kpiColumns.map((col) => [col, Number.parseFloat(row[col] as string) || 0]))
  );

  const transformedData: { [key: string]: number[] } = {};
  const summaryData: ({ index: string } & SummaryStats)[] = [];

  kpiColumns.forEach((col) => {
    const columnData = kpiData.map((row) => row[col]);
    const winsorizedData = winsorize(columnData, 0.01, 0.99);

    // Log transformation
    const minVal = Math.min(...winsorizedData);
    const constant = minVal >= 0 ? 1 : Math.abs(minVal) + 1;
    const transformedCol = winsorizedData.map((val) => Math.log(val + constant));

    // Scaling to range [0.1, 1.0]
    const minTransformed = Math.min(...transformedCol);
    const maxTransformed = Math.max(...transformedCol);
    const scaledCol = transformedCol.map(
      (val) => 0.1 + ((val - minTransformed) / (maxTransformed - minTransformed)) * 0.9
    );

    transformedData[col] = scaledCol;

    summaryData.push({
      index: col,
      Mean: calculateMean(scaledCol),
      Std_Dev: calculateStandardDeviation(scaledCol),
      Weight: weights[col],
      "33%ile_Value": calculateQuantile(scaledCol, 0.33),
      "67%ile_Value": calculateQuantile(scaledCol, 0.67),
    });
  });

  const resultData = data.map((row, index) => {
    const priorityScore = kpiColumns.reduce(
      (sum, col) => sum + transformedData[col][index] * weights[col],
      0
    );
    return { ...row, "Priority Score": priorityScore };
  });

  return { resultData, summaryData };
}

function calculateMean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

function calculateStandardDeviation(data: number[]): number {
  const mean = calculateMean(data);
  const squaredDifferences = data.map((val) => Math.pow(val - mean, 2));
  const variance = calculateMean(squaredDifferences);
  return Math.sqrt(variance);
}