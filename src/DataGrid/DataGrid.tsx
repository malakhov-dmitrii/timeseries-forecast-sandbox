import React from "react";
import styles from "./DataGrid.module.scss";
import { random } from "lodash";
import { addMonths } from "date-fns";
import { format } from "date-fns/esm";
import { Typography } from "antd";
import MockDataChart from "./components/MockDataChart";
import GrowingGeneralChart from "./components/GrowingGeneralChart";
import GeneratedDataChart from "./components/GeneratedDataChart";
import OneMoreGeneratedDataChart from "./components/OneMoreGeneratedDataChart";
import DataMiss from "./components/DataMiss";

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

        {/* <GrowingGeneralChart /> */}

        {/* <DataMiss /> */}

        {/* <GeneratedDataChart /> */}

        {/* <OneMoreGeneratedDataChart /> */}
      </div>
    </div>
  );
};

export default DataGrid;
