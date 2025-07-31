function getCleanRulerStep(maxValue: number): number {
  const roughStep = maxValue / 4; // 4 intervals = 5 marks
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const multiples = [1, 2, 5, 10];

  for (let i = 0; i < multiples.length; i++) {
    const step = multiples[i] * magnitude;
    if (step >= roughStep) {
      return step;
    }
  }

  return 10 * magnitude;
}
