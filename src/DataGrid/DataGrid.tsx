import React, { useState, useEffect } from "react";
import styles from "./DataGrid.module.scss";
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
import { mockData1, growingGeneral } from "../utils/dataSource/dummy";
import { random } from "lodash";
import forecast from "nostradamus";
import RMSE from "../utils/dataSource/computeError";
import { last, getPredictions } from "../utils/dataManagers/forecastManager";
import { parse, toDate, addMonths } from "date-fns";
import { format } from "date-fns/esm";
const FORECAST_CONFIG = {
  periodSize: 12,
  observationsToForeast: 8,
};

const generatedRandom = (size, bottom, top) => {
  const today = new Date();
  return Array.from({ length: size }).map((_, index) => {
    return {
      period: format(addMonths(today, index + 1), "yyyy-MMM"),
      value: random(bottom, top),
    };
  });
};

const DataGrid = () => {
  const [chartData, setChartData] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [generatedDataV2, setGeneratedDataV2] = useState(null);

  // Here comes calculations to fit predicted data into charts
  const fitDataGrowingGeneral = () => {
    const dataPreparedToPredict: number[] = growingGeneral.map((i) => i.sales);
    // Taking only predicted values + one point for existing history to make chart smoother
    const predictedRow = last(
      getPredictions(dataPreparedToPredict, FORECAST_CONFIG),
      FORECAST_CONFIG.observationsToForeast + 1
    );
    const newChartData = growingGeneral;

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
        reriod: format(addMonths(lastDateParsed, i + 1), "yyyy-MMM"),
        value: null,
        predicted: predictedRow[i + 1],
      });
    }
    return newChartData;
  };

  useEffect(() => {
    const ggData = fitDataGrowingGeneral();
    const mdData = fitMockData();
    setChartData(ggData);
    setMockData(mdData);

    setGeneratedData(fitGeneratedData(generatedRandom(25, 1000, 2000)));
    setGeneratedDataV2(fitGeneratedData(generatedRandom(72, 100, 150)));
  }, []);

  if (!chartData || !mockData) return null;

  return (
    <div className={styles.DataGridContainer}>
      <ResponsiveContainer width="50%">
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

      <ResponsiveContainer width="50%">
        <LineChart
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
          <Line
            type="monotone"
            dataKey="sales"
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

      <ResponsiveContainer width="50%">
        <LineChart
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
          <XAxis dataKey="period" padding={{ left: 30, right: 30 }} />
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

      <ResponsiveContainer width="50%">
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
          <XAxis dataKey="period" padding={{ left: 30, right: 30 }} />
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

export default DataGrid;
