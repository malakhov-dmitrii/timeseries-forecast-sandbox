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
import { last, getPredictions } from "../utils/dataManagers/forecastManager";
import { parse, toDate, addMonths } from "date-fns";
import { format } from "date-fns/esm";
import { Card, Typography } from "antd";
import MockDataChart from "./components/MockDataChart";
import GrowingGeneralChart from "./components/GrowingGeneralChart";
import GeneratedDataChart from "./components/GeneratedDataChart";
import OneMoreGeneratedDataChart from "./components/OneMoreGeneratedDataChart";

export const FORECAST_CONFIG = {
  periodSize: 12,
  observationsToForeast: 8,
};

export const generatedRandom = (size, bottom, top) => {
  const today = new Date();
  return Array.from({ length: size }).map((_, index) => {
    return {
      period: format(addMonths(today, index + 1), "yyyy-MMM"),
      value: random(bottom, top),
    };
  });
};

const DataGrid = () => {
  return (
    <div>
      <Typography.Title>Realtime timeseries forecast</Typography.Title>
      <div className={styles.DataGridContainer}>
        <MockDataChart />

        <GrowingGeneralChart />

        <GeneratedDataChart />

        <OneMoreGeneratedDataChart />
      </div>
    </div>
  );
};

export default DataGrid;
