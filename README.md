# Demo project with front-end predictions on time-series data

## This app is bootstapped with create-react-app

---

- CRA
- TypeScript
- Recharts.js
- Ant
- nostradamus

## It contain 2 parts:

- data representations and charts in `DataGrid` component and sub-components
- forecast module in `/src/utils/dataManagers/forecastManager.tsx`

### DataGrid

It contain components with different charts.

There are original data and utils to process it to get predictions and fit this data back into chart.

### Forecast manager

Its aim is to get input data: `number[]` and return another `number[]` with predictions.

It relies on <strong>Holt-Winters</strong> algorithm to calculate values.

It have 2 versions

- normal one, which can be called as `getPredictions( inputData: number[], config: ForecastConfig )`
- specific for cases when we dont know config params, or dont have enough data to build more accurate predictions, which can be called as `uncertainPredictions = ( inputData: number[] )`. Example - `DataMiss` component. This fn calculate possible period size and number of observations to predict based on available data.

You can find usage examples of both of them in the project.
