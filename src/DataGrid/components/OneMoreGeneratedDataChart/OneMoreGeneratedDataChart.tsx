import React, { useState, useEffect } from "react";
import styles from "./OneMoreGeneratedDataChart.module.scss";
import cn from "classnames";
import {
  last,
  getPredictions,
  maxValidDataSize,
} from "../../../utils/dataManagers/forecastManager";
import { FORECAST_CONFIG, generatedRandom } from "../../DataGrid";
import { parse, addMonths, format } from "date-fns";
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
import { Typography } from "antd";

const fitGeneratedData = (inputData) => {
  const dataPreparedToPredict: number[] = inputData.map((i) => i.value);
  // Taking only predicted values + one point for existing history to make chart smoother
  const predictedRow = last(
    getPredictions(dataPreparedToPredict, FORECAST_CONFIG),
    FORECAST_CONFIG.observationsToForeast + 1
  );
  const newChartData = inputData;

  console.log(predictedRow);

  // Make point with last available historical data and first predicted one
  newChartData[newChartData.length - 1] = {
    ...newChartData[newChartData.length - 1],
    predicted: predictedRow[0],
  };

  const lastDate = last(newChartData)[0]?.period;

  const lastDateParsed = parse(lastDate, "yyyy-MMM", new Date());
  console.log(lastDateParsed, addMonths(lastDateParsed, 1));

  for (let i = 0; i < FORECAST_CONFIG.observationsToForeast; i++) {
    newChartData.push({
      period: format(addMonths(lastDateParsed, i + 1), "yyyy-MMM"),
      value: null,
      predicted: predictedRow[i + 1],
    });
  }
  return newChartData;
};

const OneMoreGeneratedDataChart = () => {
  const [generatedDataV2, setGeneratedDataV2] = useState(null);

  useEffect(() => {
    setGeneratedDataV2(fitGeneratedData(generatedRandom(72, 100, 150)));
  }, []);

  const title = (
    <>
      <Typography.Title level={3}>
        Line chart example - data generated randomly
      </Typography.Title>
      <Typography.Text>
        (Period size: {FORECAST_CONFIG.periodSize}; Observations to forecast:{" "}
        {FORECAST_CONFIG.observationsToForeast})
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Dataset size: {generatedDataV2?.length}; Predictions are based on last{" "}
        <b>
          {generatedDataV2 &&
            maxValidDataSize(
              generatedDataV2.length,
              FORECAST_CONFIG.periodSize
            )}{" "}
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
          data={generatedDataV2}
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
};

export default OneMoreGeneratedDataChart;
