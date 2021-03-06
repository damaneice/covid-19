import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const createDailyDeathsChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      x: i,
      y: county.chart[i].newDeaths,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }
  return chartData
}

const DailyDeathsChart = ({ counties, selectedNames, updatedDate }) => {
  const selectedDailyCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createDailyDeathsChartData(counties[name]),
    }
  })

  return (
    <div>
      {selectedDailyCounties.length > 0 && (
        <ChartWithLegend
          name="New Daily Deaths by County"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedDailyCounties}
          updatedDate={updatedDate}
        />
      )}
    </div>
  )
}

export default DailyDeathsChart
