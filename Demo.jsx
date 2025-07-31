function getCleanRulerStep(maxValue: number): number {
if (maxValue <= 0) return 1;
  
  // Find the minimum step needed (maxValue / 4, rounded up)
  const minStep = Math.ceil(maxValue / 4);
  
  // Find the order of magnitude of minStep
  const magnitude = Math.pow(10, Math.floor(Math.log10(minStep)));
  
  // Common clean multipliers for ruler steps
  const cleanMultipliers = [1, 2, 2.5, 5];
  
  // Find the smallest clean step that satisfies our requirement
  for (const multiplier of cleanMultipliers) {
    const candidateStep = magnitude * multiplier;
    if (candidateStep >= minStep) {
      return candidateStep;
    }
  }
  
  // If none of the multipliers work, go to the next magnitude
  return magnitude * 10;
}
