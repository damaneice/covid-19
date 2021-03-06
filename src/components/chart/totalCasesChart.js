import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const createTotalCaseChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      x: i,
      y: county.chart[i].totalCases,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }
  return chartData
}

const TotalCasesChart = ({ counties, selectedNames, updatedDate }) => {
  const selectedTotalCaseCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createTotalCaseChartData(counties[name]),
    }
  })

  return (
    <div>
      {selectedTotalCaseCounties.length > 0 && (
        <ChartWithLegend
          name="Total Cases by County"
          margin={{ top: 20, bottom: 80, right: 5, left: 50 }}
          data={selectedTotalCaseCounties}
          updatedDate={updatedDate}
        />
      )}
    </div>
  )
}

export default TotalCasesChart
