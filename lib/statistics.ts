// lib/statistics.ts


export function winsorize(data: number[], lowerPercentile: number, upperPercentile: number): number[] {
  const sortedData = [...data].sort((a, b) => a - b);
  const lowerBound = calculateQuantile(sortedData, lowerPercentile);
  const upperBound = calculateQuantile(sortedData, upperPercentile);

  return data.map((val) => 
    val < lowerBound ? lowerBound : val > upperBound ? upperBound : val
  );
}

export function calculateQuantile(sortedData: number[], percentile: number): number {
  const index = percentile * (sortedData.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const weight = index - lowerIndex;

  if (upperIndex === lowerIndex) {
    return sortedData[lowerIndex];
  }

  return (1 - weight) * sortedData[lowerIndex] + weight * sortedData[upperIndex];
}
