function getCleanRulerStep(maxValue: number): number {
  const roughStep = maxValue / 10;

  // Round roughStep to the next "nice" power-of-10 multiple
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const multiples = [1, 2, 5, 10];

  for (let i = 0; i < multiples.length; i++) {
    const cleanStep = multiples[i] * magnitude;
    if (cleanStep >= roughStep) {
      return cleanStep;
    }
  }

  // fallback in case nothing matches (shouldn't happen)
  return 10 * magnitude;
}
