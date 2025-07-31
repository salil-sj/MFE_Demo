function getCleanRulerStep(maxValue: number): number {
  const roughStep = maxValue / 5; // 👈 Only change from 10 to 5

  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const multiples = [1, 2, 5, 10];

  for (let i = 0; i < multiples.length; i++) {
    const cleanStep = multiples[i] * magnitude;
    if (cleanStep >= roughStep) {
      return cleanStep;
    }
  }

  return 10 * magnitude;
}
