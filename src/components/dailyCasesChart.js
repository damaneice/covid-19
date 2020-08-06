import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const createDailyCasesChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      x: i,
      y: county.chart[i].cases,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }
  return chartData
}

const DailyCasesChart = ({ counties, selectedNames }) => {
  const selectedDailyCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createDailyCasesChartData(counties[name]),
    }
  })

  return (
    <div>
      {selectedDailyCounties.length > 0 && (
        <ChartWithLegend
          name="New Daily Cases by County"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedDailyCounties}
        />
      )}
    </div>
  )
}

export default DailyCasesChart
