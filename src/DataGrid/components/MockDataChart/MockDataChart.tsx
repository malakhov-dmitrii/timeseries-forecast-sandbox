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
  AreaChart,
  Area,
  CartesianAxis,
  ReferenceLine,
  Label,
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

const CustomizedAxisTick = (props) => {
  const { x, y, stroke, payload, data } = props;
  // console.log(props);
  const content = data.find((i) => i.Period === payload.value)?.Sales;
  const contentPredicted = data.find((i) => i.Period === payload.value)
    ?.predicted;

  console.log(contentPredicted);

  return (
    <>
      <g transform={`translate(${x}, ${0})`} z={9999}>
        <text
          x={10}
          y={0}
          dy={16}
          fontSize={12}
          textAnchor="end"
          fill="#fff"
          transform="rotate(0)"
        >
          {content ? `${content}k` : `${contentPredicted.toFixed(2)}k`}
        </text>
      </g>
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          fontSize={12}
          textAnchor="end"
          fill="#fff"
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    </>
  );
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
    let newChartData = mockData1;

    // Make point with last available historical data and first predicted one
    // newChartData = newChartData.map
    newChartData[newChartData.length - 1] = {
      ...newChartData[newChartData.length - 1],
      predicted: newChartData[newChartData.length - 1].Sales,
      precisionArea: [
        newChartData[newChartData.length - 1].Sales,
        newChartData[newChartData.length - 1].Sales,
      ],
    };

    const lastDate = last(newChartData)[0]?.Period;

    const lastDateParsed = parse(lastDate, "yyyy-MMM", new Date());
    console.log(lastDateParsed, addMonths(lastDateParsed, 1));

    // // See how predictions correlate with historical data
    // newChartData = newChartData.map((i, index) => {
    //   return {
    //     ...i,
    //     predicted: getPredictions(dataPreparedToPredict, FORECAST_CONFIG)[
    //       index + 1
    //     ],
    //   };
    // });

    for (let i = 0; i < FORECAST_CONFIG.observationsToForeast; i++) {
      newChartData.push({
        Period: format(addMonths(lastDateParsed, i + 1), "yyyy-MMM"),
        Sales: null,
        precisionArea: [
          Number((predictedRow[i + 1] * (1 + (i + 1) / 9)).toFixed(2)),
          Number((predictedRow[i + 1] * (1 - (i + 1) / 9)).toFixed(2)),
        ],
        predicted: Number(predictedRow[i + 1].toFixed(2)),
      });
    }
    return newChartData;
  };

  useEffect(() => {
    const mockData = fitMockData();
    console.log(mockData)
    setMockData(mockData);
  }, []);

  const title = (
    <div style={{ color: "white", marginBottom: "30px" }}>
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
    </div>
  );

  return (
    <div
      style={{
        width: "50%",
        height: "100%",
        paddingBottom: "150px",
        margin: "auto",
        minWidth: "100%",
        background: "linear-gradient(to left, rgb(101,120,124) 0%, rgb(50, 60, 62) 100%)",
        backgroundImage: "linear-gradient(to left, rgb(101, 120, 124) 0%, rgb(50, 60, 62) 100%)",
        backgroundPositionX: "initial",
        backgroundPositionY: "initial",    
        backgroundSize: "initial",   
        backgroundAttachment: "initial",   
        backgroundOrigin: "initial",    
        backgroundClip: "initial",   
        backgroundColor: "initial"
      }}
    >
      {title}

      <ResponsiveContainer width="100%">
        <AreaChart
          width={600}
          height={300}
          data={mockData}
          margin={{
            top: 25,
            right: 30,
            left: 50,
            // bottom: 5,
          }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 5"
            strokeWidth={2}
            x={mockData?.find((i) => i.predicted && i.Sales)?.Period}
          
          />
          <XAxis
            height={60}
            dataKey="Period"
            interval={0}
            tick={<CustomizedAxisTick data={mockData} />}
          />
          <YAxis type="number" hide domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#f18153"
            fill="#f18153"
            activeDot={{ r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="precisionArea"
            stroke="#2a9d8f"
            activeDot={{ r: 3 }}
          />
          <Area
            type="linear"
            dataKey="Sales"
            stroke="#fff"
            fill="#f18153"
            dot={{ stroke: "white", strokeWidth: 2, r: 4, fill: "black" }}
            strokeWidth={3}
            fillOpacity={1}
            activeDot={{ r: 3 }}
          />

          <ReferenceLine
            x={mockData?.find((i) => i.predicted && i.Sales)?.Period}
            stroke="black"
            strokeWidth={2}
            strokeDasharray="15 5"
            label={
              <Label
                value="Forecast start"
                fontWeight={600}
                fontSize={18}
                position="centerTop"
                fill="#fff"
              />
            }
          />

          <Brush height={20} startIndex={mockData?.length - 16} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MockDataChart;
