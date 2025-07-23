interface BarChartData {
  taxSavingsSinglePurchase: number;
  improvementWithStaggering: number;
  taxSavingsOfStaggeredPurchase: number;
  widgetWidth: number;
}

interface BarSegment {
  height: number;
  emptyHeight: number;
  label: string;
  color: string;
}

export function calculateBarHeights(data: BarChartData): {
  singlePurchase: BarSegment;
  improvement: BarSegment;
  staggeredPurchase: BarSegment;
} {
  const o = data;

  // Default segment height fallback
  const defaultHeight = 100;
  let minLines = o.widgetWidth < 500 ? 3 : 2;

  // === 1. Tax savings from single purchase ===
  let taxSavingsSinglePurchaseHeight = o.taxSavingsSinglePurchase;
  let taxSavingsSinglePurchaseEmptySegmentHeight = o.improvementWithStaggering < 0 ? 0 : o.improvementWithStaggering;

  if (Math.abs(o.improvementWithStaggering) === Math.abs(o.taxSavingsSinglePurchase)) {
    taxSavingsSinglePurchaseHeight = 100;
  }
  if (taxSavingsSinglePurchaseHeight === 0) {
    taxSavingsSinglePurchaseHeight = 100;
  }

  const singlePurchase: BarSegment = {
    height: taxSavingsSinglePurchaseHeight,
    emptyHeight: taxSavingsSinglePurchaseEmptySegmentHeight,
    label: "Tax savings single purchase",
    color: "fern"
  };

  // === 2. Improvement with staggering ===
  let improvementWithStaggeringHeight = o.improvementWithStaggering;
  let improvementWithStaggeringEmptySegmentHeight = o.taxSavingsSinglePurchase;

  if (Math.abs(o.improvementWithStaggering) === Math.abs(o.taxSavingsSinglePurchase)) {
    improvementWithStaggeringHeight = 100;
  }

  if (o.improvementWithStaggering === 0 && o.taxSavingsSinglePurchase === 0) {
    improvementWithStaggeringEmptySegmentHeight = 100;
  }

  const improvement: BarSegment = {
    height: improvementWithStaggeringHeight,
    emptyHeight: improvementWithStaggeringEmptySegmentHeight,
    label: "Improvement with staggering",
    color: "stone"
  };

  // === 3. Tax savings of staggered purchase ===
  let taxSavingsOfStaggeredPurchaseHeight = o.taxSavingsOfStaggeredPurchase;
  let taxSavingsOfStaggeredPurchaseEmptySegmentHeight = 0;
  let barColor = "olive";

  if (o.improvementWithStaggering < 0) {
    barColor = "smoke";
    if (Math.abs(o.improvementWithStaggering) === Math.abs(o.taxSavingsSinglePurchase)) {
      taxSavingsOfStaggeredPurchaseHeight = 0;
      taxSavingsOfStaggeredPurchaseEmptySegmentHeight = 100;
    } else {
      taxSavingsOfStaggeredPurchaseEmptySegmentHeight = o.improvementWithStaggering;
    }
  }

  if (taxSavingsOfStaggeredPurchaseHeight === 0) {
    taxSavingsOfStaggeredPurchaseHeight = 100;
  }

  const staggeredPurchase: BarSegment = {
    height: taxSavingsOfStaggeredPurchaseHeight,
    emptyHeight: taxSavingsOfStaggeredPurchaseEmptySegmentHeight,
    label: "Tax savings staggered purchase",
    color: barColor
  };

  return {
    singlePurchase,
    improvement,
    staggeredPurchase
  };
}
