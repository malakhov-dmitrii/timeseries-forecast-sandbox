import React, { useState, useEffect } from "react";
import styles from "./DataMiss.module.scss";
import cn from "classnames";
import {
  last,
  getPredictions,
  maxValidDataSize,
  uncertainPredictions,
} from "../../../utils/dataManagers/forecastManager";
import { parse, addMonths, format } from "date-fns";
import { generatedRandom } from "../../DataGrid";
import { Typography } from "antd";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Brush,
} from "recharts";

export const FORECAST_CONFIG = {
  periodSize: 6,
  observationsToForeast: 6,
};

const DataMiss = () => {
  const [data, setData] = useState(null);

  const [bestObs, setBestObs] = useState(null);
  const [bestPeriod, setBestPeriod] = useState(null);

  const fitGeneratedData = (inputData) => {
    const dataPreparedToPredict: number[] = inputData.map((i) => i.value);

    //   const forecasted = getPredictions(
    //     dataPreparedToPredict,
    //     FORECAST_CONFIG
    //   );

    const {
      bestObservationsToPredict,
      bestPeriodSize,
      predictions,
    } = uncertainPredictions(dataPreparedToPredict);

    setBestObs(bestObservationsToPredict);
    setBestPeriod(bestPeriodSize);

    //   If we cant make predictions - we return original data
    if (!predictions.length) return inputData;

    // Taking only predicted values + one point for existing history to make chart smoother
    const predictedRow = last(predictions, bestObservationsToPredict + 1);
    const newChartData = inputData;

    console.log(predictedRow);

    // Make point with last available historical data and first predicted one
    newChartData[newChartData.length - 1] = {
      ...newChartData[newChartData.length - 1],
      predicted: newChartData[newChartData.length - 1].value,
    };

    const lastDate = last(newChartData)[0]?.period;

    const lastDateParsed = parse(lastDate, "yyyy-MMM", new Date());
    console.log(lastDateParsed, addMonths(lastDateParsed, 1));

    for (let i = 0; i < bestObservationsToPredict; i++) {
      newChartData.push({
        period: format(addMonths(lastDateParsed, i + 1), "yyyy-MMM"),
        value: null,
        predicted: predictedRow[i + 1],
      });
    }
    return newChartData;
  };

  useEffect(() => {
    setData(fitGeneratedData(generatedRandom(39, 100, 150)));
  }, []);

  const title = (
    <>
      <Typography.Title level={3}>
        Line chart - low input data amount
      </Typography.Title>
      <Typography.Text>
        (Period size: {bestPeriod}; Observations to forecast: {bestObs})
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Dataset size: {data?.length}; Predictions are based on last{" "}
        <b>
          {data && maxValidDataSize(data.length, FORECAST_CONFIG.periodSize)}{" "}
        </b>
        records
      </Typography.Text>
    </>
  );

  return (
    <div
      style={{
        width: "50%",
        height: "100%",
        paddingBottom: "110px",
        margin: "auto",
        minWidth: "400px",
      }}
    >
      {title}
      <ResponsiveContainer width="100%">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" padding={{ left: 15, right: 15 }} />
          <YAxis
            type="number"
            domain={[
              (dataMin) => {
                let dm = dataMin;
                return Number((dm /= 1.2).toFixed(2));
              },
              (dataMax) => {
                let dm = dataMax;
                return Number((dm *= 1.2).toFixed(2));
              },
            ]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#000"
            activeDot={{ r: 3 }}
          />
          <Brush />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  // )
};

export default DataMiss;
