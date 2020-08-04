import forecast from "nostradamus";
import RMSE from "../dataSource/computeError";
import { da } from "date-fns/locale";

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

interface ForecastParams {
  alpha: number;
  beta: number;
  gamma: number;

  bestPeriodSize?: number;
  bestObservationsToPredict?: number;
}

/**
 * Calculate predictions for set of params to find optimal ones.
 * Can calculate config options if special flag is provided
 *
 * @param {number[]} data
 * @param {ForecastConfig} options
 * @param {boolean} [adjustOptions=false] use on your own risk - finds optimal number of predictions and period size
 * @returns {ForecastParams}
 */
const adjustParams = (
  data: number[],
  options: ForecastConfig | null,
  adjustOptions = false
): ForecastParams => {
  let observationsToForeast, periodSize;

  if (options) {
    observationsToForeast = options.observationsToForeast;
    periodSize = options.periodSize;
  }

  if (adjustOptions) {
    console.log({ adjustOptions });
  }

  let bestObs = 0;
  let bestPeriodSize = 0;

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

  /**
   * If we adjust period size - we go from 0 to the length of the input data
   * Then number of observations to predict should be between 1 and period size
   * */

  if (adjustOptions) {
    // Adjust period size
    for (let p = 1; p <= data.length; p++) {
      // Adjust observations to predict
      for (let obs = 1; obs <= p; obs++) {
        // If we dont have 2 complete periods yet, we skip calcs

        // Period size
        const pSize = data.length / p;

        if (pSize >= 2) {
          // Adjust Alpha
          for (let a = 0; a < 1; a = safeSum(a, adjustmentStep)) {
            // Adjust Beta
            for (let b = 0; b < 1; b = safeSum(b, adjustmentStep)) {
              // Adjust Gamma
              for (let g = 0; g < 1; g = safeSum(g, adjustmentStep)) {
                try {
                  // Get predictions based on current coefficents
                  const predictions = forecast(data, a, b, g, p, obs);
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
                    bestObs = obs;
                    bestPeriodSize = p;
                  }
                } catch (error) {}
              }
            }
          }
        }
      }
    }
  } else {
    // safeSum is needed to avoid cases where sum becomes 0.75000000003 and things like that
    for (let a = 0; a < 1; a = safeSum(a, adjustmentStep)) {
      for (let b = 0; b < 1; b = safeSum(b, adjustmentStep)) {
        for (let g = 0; g < 1; g = safeSum(g, adjustmentStep)) {
          // Get predictions based on current coefficents
          const predictions = forecast(
            data,
            a,
            b,
            g,
            periodSize,
            observationsToForeast
          );

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
  }

  console.log({
    bestError,
    bestAlpha,
    bestBeta,
    bestGamma,
    bestPeriodSize,
    bestObs,
  });

  return {
    alpha: bestAlpha,
    beta: bestBeta,
    gamma: bestGamma,
    bestObservationsToPredict: bestObs,
    bestPeriodSize,
  };
};

export const uncertainPredictions = (
  inputData: number[]
): {
  predictions: number[];
  bestObservationsToPredict: number;
  bestPeriodSize: number;
} => {
  const {
    alpha,
    beta,
    gamma,
    bestObservationsToPredict,
    bestPeriodSize,
  } = adjustParams(inputData, null, true);

  //   Get final result based on optimal params
  const predictions: number[] = forecast(
    inputData,
    alpha,
    beta,
    gamma,
    bestPeriodSize,
    bestObservationsToPredict
  );
  return { predictions, bestObservationsToPredict, bestPeriodSize };
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
 * @param {number[]} inputData input array to predict on.
 * Should contain data for at least TWO complete periods.
 *
 * @param {ForecastConfig} FORECAST_CONFIG configure number of observations per season(period)
 * & number of observations to forecast
 *
 * @param {boolean} adjustConfig needs if we know that data is insufficient
 * and we want to adjust number of observations to forecast and period size
 *
 * @returns {number[]} an array with valid length + N more items.
 *  - All of them are predicted.
 *  - Data can differ from orginal one.
 */
export const getPredictions = (
  inputData: number[],
  config: ForecastConfig
): number[] | null => {
  // # of observations per season
  const period = config.periodSize;

  // # of future observations to forecast
  const m = config.observationsToForeast;

  // We cant predict more than one full period
  if (period < m) return null;

  // Prepare data to become valid size
  // Take last N elems to make input data properly sized
  const lastN = maxValidDataSize(inputData.length, period);

  //   If there are no 2 complete periods with historical data, we cant build predictions
  if (lastN < period * 2) return null;

  const data: number[] = last(inputData, lastN);

  const { alpha, beta, gamma } = adjustParams(data, config);

  //   Get final result based on optimal params
  const predictions: number[] = forecast(data, alpha, beta, gamma, period, m);
  return predictions;
};
