import React, { useState, useEffect } from "react";
import styles from "./MockDataChart.module.scss";
import cn from "classnames";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { mockData1 } from "../../../utils/dataSource/dummy";
import {
  last,
  getPredictions,
  maxValidDataSize,
} from "../../../utils/dataManagers/forecastManager";
import { parse, addMonths, format } from "date-fns";
import { Typography } from "antd";

const FORECAST_CONFIG = {
  periodSize: 5,
  observationsToForeast: 4,
};

const MockDataChart = () => {
  const [mockData, setMockData] = useState(null);

  const fitMockData = () => {
    const dataPreparedToPredict: number[] = mockData1.map((i) => i.Sales);
    // Taking only predicted values + one point for existing history to make chart smoother
    const predictedRow = last(
      getPredictions(dataPreparedToPredict, FORECAST_CONFIG),
      FORECAST_CONFIG.observationsToForeast + 1
    );
    const newChartData = mockData1;

    // Make point with last available historical data and first predicted one
    newChartData[newChartData.length - 1] = {
      ...newChartData[newChartData.length - 1],
      predicted: predictedRow[0],
    };

    const lastDate = last(newChartData)[0]?.Period;

    const lastDateParsed = parse(lastDate, "yyyy-MMM", new Date());
    console.log(lastDateParsed, addMonths(lastDateParsed, 1));

    for (let i = 0; i < FORECAST_CONFIG.observationsToForeast; i++) {
      newChartData.push({
        Period: format(addMonths(lastDateParsed, i + 1), "yyyy-MMM"),
        Sales: null,
        predicted: predictedRow[i + 1],
      });
    }
    return newChartData;
  };

  useEffect(() => {
    setMockData(fitMockData());
  }, []);

  const title = (
    <>
      <Typography.Title level={3}>Line chart example</Typography.Title>
      <Typography.Text>
        (Period size: {FORECAST_CONFIG.periodSize}; Observations to forecast:{" "}
        {FORECAST_CONFIG.observationsToForeast})
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Dataset size: {mockData?.length}; Predictions are based on last{" "}
        <b>
          {mockData &&
            maxValidDataSize(mockData.length, FORECAST_CONFIG.periodSize)}{" "}
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
          data={mockData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Period" />
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
            dataKey="Sales"
            stroke="#264653"
            activeDot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#2a9d8f"
            activeDot={{ r: 3 }}
          />

          <Brush />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MockDataChart;
