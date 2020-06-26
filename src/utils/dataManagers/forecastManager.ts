import forecast from "nostradamus";
import RMSE from "../dataSource/computeError";

export const safeSum = (a: number, b: number, precision = 2): number => {
  return Number(parseFloat(String(a + b)).toFixed(precision));
};

export const last = (array: any[], n?: number): any[] => {
  if (array == null) return void 0;
  if (n == null) return [array[array.length - 1]];
  return array.slice(Math.max(array.length - n, 0));
};

export const maxValidDataSize = (
  dataSize: number,
  periodSize: number
): number => {
  const mod = dataSize % periodSize;
  return dataSize - mod;
};

interface ForecastConfig {
  periodSize: number;
  observationsToForeast: number;
}
/**
 * Predict data for numbered array based on Holt-Winters algorithm.
 * Number of periods to forecast should be less or equal to size of period;
 *
 *
 * @param {number[]} inputData - input array to predict on.
 * Should contain data for at least TWO complete periods.
 *
 * @param {ForecastConfig} FORECAST_CONFIG - configure number of observations per season(period)
 * & number of observations to forecast
 *
 * @returns {number[]} an array with valid length + N more items.
 *  - All of them are predicted.
 *  - Data can differ from orginal one.
 */
export const getPredictions = (
  inputData: number[],
  FORECAST_CONFIG: ForecastConfig
): number[] => {
  // # of observations per season
  const period = FORECAST_CONFIG.periodSize;

  // # of future observations to forecast
  const m = FORECAST_CONFIG.observationsToForeast;

  // We cant predict more than one full period
  if (period < m) return null;

  // overall smoothing component
  let bestAlpha = 0;
  // trend smoothing component
  let bestBeta = 0;
  // seasonal smoothing component
  let bestGamma = 0;
  // minimal error rate
  let bestError = Number.MAX_SAFE_INTEGER;
  // interval to increase coefficents over iterations
  const adjustmentStep = 0.1;

  // Prepare data to become valid size
  // Take last N elems to make input data properly sized
  const lastN = maxValidDataSize(inputData.length, period);

  //   If there are no 2 complete periods with historical data, we cant build predictions
  if (lastN < period * 2) return null;

  const data: number[] = last(inputData, lastN);

  // safeSum is needed to avoid cases where sum becomes 0.75000000003 and things like that
  for (let a = 0; a < 1; a = safeSum(a, adjustmentStep)) {
    for (let b = 0; b < 1; b = safeSum(b, adjustmentStep)) {
      for (let g = 0; g < 1; g = safeSum(g, adjustmentStep)) {
        // Get predictions based on current coefficents
        const predictions = forecast(data, a, b, g, period, m);

        //   Prepare to calc squared mean error
        const errorDataCalc = data.map((i, index: number) => ({
          actual: i,
          predicted: predictions[index],
        }));

        //   Lower rate - better;
        const errorRate = RMSE.rmse(errorDataCalc);

        // Update best marks
        if (errorRate < bestError) {
          bestError = errorRate;
          bestAlpha = a;
          bestBeta = b;
          bestGamma = g;
        }
      }
    }
  }

  //   Get final result based on optimal params
  const predictions: number[] = forecast(
    data,
    bestAlpha,
    bestBeta,
    bestGamma,
    period,
    m
  );

  console.log({
    bestError,
    bestAlpha,
    bestBeta,
    bestGamma,
  });
  return predictions;
};
