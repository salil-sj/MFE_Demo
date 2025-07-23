/**
 * Calculates bar chart data for three financial parameters
 * @param {Object} options - Configuration object
 * @param {number} options.taxSavingsSinglePurchase - Tax savings from single purchase
 * @param {number} options.improvementWithStaggering - Improvement amount with staggering
 * @param {number} options.taxSavingsOfStaggeredPurchase - Tax savings from staggered purchase
 * @param {number} options.widgetWidth - Width of the widget (default: 600)
 * @returns {Object} Bar chart configuration with heights and colors
 */
function calculateBarChartData(options) {
  const {
    taxSavingsSinglePurchase = 0,
    improvementWithStaggering = 0,
    taxSavingsOfStaggeredPurchase = 0,
    widgetWidth = 600
  } = options;

  // Color constants
  const COLORS = {
    FERN: '#4CAF50',      // Green color for improvement bars
    STONE: '#9E9E9E',     // Gray color for regular bars
    OLIVE: '#8BC34A',     // Light green for staggered purchase
    SMOKE: '#757575',     // Dark gray
    TRANSPARENT: 'transparent'
  };

  // Calculate heights for bar 1 (Tax Savings Single Purchase)
  let bar1Height = Math.abs(taxSavingsSinglePurchase);
  let bar1EmptySegmentHeight = improvementWithStaggering;

  if (improvementWithStaggering < 0) {
    bar1EmptySegmentHeight = 0;
    if (Math.abs(improvementWithStaggering) === Math.abs(taxSavingsSinglePurchase)) {
      bar1Height = 100;
    }
  }

  if (bar1Height === 0) {
    bar1Height = 100;
  }

  // Calculate minimum lines based on widget width
  let minLines = 2;
  if (widgetWidth < 500) {
    minLines = 3;
  }

  // Bar 1 configuration
  const bar1 = {
    height: bar1Height,
    color: COLORS.FERN,
    emptySegmentHeight: bar1EmptySegmentHeight,
    segments: [
      {
        height: bar1EmptySegmentHeight,
        color: COLORS.TRANSPARENT,
        label: '',
        value: ''
      },
      {
        height: bar1Height,
        color: COLORS.FERN,
        label: 'Tax savings single purchase',
        value: `${taxSavingsSinglePurchase}`,
        minLines: minLines
      }
    ]
  };

  // Calculate heights for bar 2 (Improvement with Staggering)
  let bar2Height = Math.abs(improvementWithStaggering);
  let bar2EmptySegmentHeight = taxSavingsSinglePurchase;

  if (improvementWithStaggering < 0) {
    bar2EmptySegmentHeight = 0;
    if (Math.abs(improvementWithStaggering) === Math.abs(taxSavingsSinglePurchase)) {
      bar2Height = 100;
    }
  } else {
    bar2EmptySegmentHeight = improvementWithStaggering;
  }

  if (improvementWithStaggering === 0 && taxSavingsSinglePurchase === 0) {
    bar2EmptySegmentHeight = 100;
  }

  // Bar 2 configuration
  const bar2 = {
    height: bar2Height,
    color: COLORS.STONE,
    emptySegmentHeight: bar2EmptySegmentHeight,
    segments: [
      {
        height: bar2EmptySegmentHeight,
        color: COLORS.TRANSPARENT,
        label: '',
        value: ''
      },
      {
        height: bar2Height,
        color: COLORS.STONE,
        label: 'Improvement with staggering',
        value: `${improvementWithStaggering}`,
        minLines: minLines
      }
    ]
  };

  // Calculate heights for bar 3 (Tax Savings of Staggered Purchase)
  let bar3Height = Math.abs(taxSavingsOfStaggeredPurchase);
  let bar3EmptySegmentHeight = 0;

  if (bar3Height === 0) {
    bar3Height = 100;
  }

  let bar3Color = COLORS.OLIVE;
  if (improvementWithStaggering < 0) {
    bar3Color = COLORS.SMOKE;
    if (Math.abs(improvementWithStaggering) === Math.abs(taxSavingsSinglePurchase)) {
      bar3Height = 0;
      bar3EmptySegmentHeight = 100;
    } else {
      bar3EmptySegmentHeight = improvementWithStaggering;
    }
  }

  // Bar 3 configuration
  const bar3 = {
    height: bar3Height,
    color: bar3Color,
    emptySegmentHeight: bar3EmptySegmentHeight,
    segments: [
      {
        height: bar3EmptySegmentHeight,
        color: COLORS.TRANSPARENT,
        label: '',
        value: ''
      },
      {
        height: bar3Height,
        color: bar3Color,
        label: 'Tax savings of staggered purchase',
        value: `${taxSavingsOfStaggeredPurchase}`,
        minLines: minLines
      }
    ]
  };

  return {
    bars: [bar1, bar2, bar3],
    colors: COLORS,
    widgetWidth,
    minLines
  };
}

// Example usage:
const exampleData = calculateBarChartData({
  taxSavingsSinglePurchase: 1500,
  improvementWithStaggering: 300,
  taxSavingsOfStaggeredPurchase: 1800,
  widgetWidth: 600
});

console.log('Example output:', exampleData);

// Export for use in React components
export default calculateBarChartData;
