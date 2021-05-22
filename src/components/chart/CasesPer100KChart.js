import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const createChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      x: i,
      y: county.chart[i].casesAvgPer100K,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }
  return chartData
}

const CasesPer100kChart = ({ counties, selectedNames, updatedDate }) => {
  const selecteCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createChartData(counties[name]),
    }
  })

  return (
    <div>
       <ChartWithLegend
          name="Cases per 100k by County"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selecteCounties}
          updatedDate={updatedDate}
        />
    </div>
  )
}

export default CasesPer100kChart
