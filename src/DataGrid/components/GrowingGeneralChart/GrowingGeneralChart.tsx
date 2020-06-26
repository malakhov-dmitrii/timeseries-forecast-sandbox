import React, { useState, useEffect } from "react";
import styles from "./GrowingGeneralChart.module.scss";
import cn from "classnames";
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
  AreaChart,
  Area,
} from "recharts";
import {
  last,
  getPredictions,
  maxValidDataSize,
} from "../../../utils/dataManagers/forecastManager";
import { growingGeneral } from "../../../utils/dataSource/dummy";
import { FORECAST_CONFIG } from "../../DataGrid";
import { Typography } from "antd";

const GrowingGeneralChart = () => {
  const [chartData, setChartData] = useState(null);

  // Here comes calculations to fit predicted data into charts
  const fitDataGrowingGeneral = (inputData) => {
    const dataPreparedToPredict: number[] = inputData.map((i) => i.sales);
    // Taking only predicted values + one point for existing history to make chart smoother
    const predictedRow = last(
      getPredictions(dataPreparedToPredict, FORECAST_CONFIG),
      FORECAST_CONFIG.observationsToForeast + 1
    );
    const newChartData = inputData;

    // Make point with last available historical data and first predicted one
    newChartData[newChartData.length - 1] = {
      ...newChartData[newChartData.length - 1],
      predicted: predictedRow[0],
    };

    for (let i = 0; i < FORECAST_CONFIG.observationsToForeast; i++) {
      newChartData.push({
        p: i,
        sales: null,
        predicted: predictedRow[i + 1],
      });
    }
    return newChartData;
  };
  useEffect(() => {
    const ggData = fitDataGrowingGeneral(growingGeneral);
    setChartData(ggData);
  }, []);

  const title = (
    <>
      <Typography.Title level={3}>Area chart example</Typography.Title>
      <Typography.Text>
        (Period size: {FORECAST_CONFIG.periodSize}; Observations to forecast:{" "}
        {FORECAST_CONFIG.observationsToForeast})
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Dataset size: {chartData?.length}; Predictions are based on last{" "}
        <b>
          {chartData &&
            maxValidDataSize(chartData.length, FORECAST_CONFIG.periodSize)}{" "}
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
        <AreaChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="p" padding={{ left: 30, right: 30 }} />
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
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#f77f00"
            fill="#fcbf49"
            activeDot={{ r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#8884d8"
            fill="#8884d8"
            activeDot={{ r: 3 }}
          />
          <Brush />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowingGeneralChart;
