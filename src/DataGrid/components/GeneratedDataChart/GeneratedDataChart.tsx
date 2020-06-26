import React, { useState, useEffect } from "react";
import styles from "./GeneratedDataChart.module.scss";
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
  BarChart,
  Bar,
} from "recharts";
import {
  last,
  getPredictions,
  maxValidDataSize,
} from "../../../utils/dataManagers/forecastManager";
import { generatedRandom } from "../../DataGrid";
import { parse, addMonths, format } from "date-fns";
import { Typography } from "antd";

export const FORECAST_CONFIG = {
  periodSize: 3,
  observationsToForeast: 3,
};

const GeneratedDataChart = () => {
  const [generatedData, setGeneratedData] = useState(null);

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
        // value: 0,
        predicted: predictedRow[i + 1],
      });
    }
    return newChartData;
  };

  useEffect(() => {
    setGeneratedData(fitGeneratedData(generatedRandom(25, 1000, 2000)));
  }, []);

  const title = (
    <>
      <Typography.Title level={3}>
        Bar chart example - data generated randomly
      </Typography.Title>
      <Typography.Text>
        (Period size: {FORECAST_CONFIG.periodSize}; Observations to forecast:{" "}
        {FORECAST_CONFIG.observationsToForeast})
      </Typography.Text>
      <br />
      <Typography.Text type="secondary">
        Dataset size: {generatedData?.length}; Predictions are based on last{" "}
        <b>
          {generatedData &&
            maxValidDataSize(
              generatedData.length,
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
        <BarChart
          width={600}
          height={300}
          data={generatedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" padding={{ left: 10, right: 10 }} />
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
          <Bar
            barSize={5}
            dataKey="value"
            stroke="#023e8a"
            fill="#0077b6"
            fillOpacity="0.5"
          />
          <Bar
            barSize={5}
            dataKey="predicted"
            stroke="#0077b6"
            fill="#023e8a"
          />
          <Brush />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeneratedDataChart;
