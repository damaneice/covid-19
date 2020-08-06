import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const createCasesChartData = county => {
  const chartData = []
  let subset = []
  for (let i = 0; i < county.chart.length; i++) {
    subset.push(county.chart[i])
    if ((i + 1) % 7 === 0 || i === county.chart.length - 1) {
      let total = subset.reduce((acc, current) => acc + current.cases, 0)
      chartData.push({
        value: total / subset.length,
        date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
      })
      subset = []
    }
  }
  return chartData.map((y, index) => {
    return { x: index, y: y.value, date: y.date }
  })
}

const RollingAverageCasesChart = ({ counties, selectedNames }) => {
  const selectedCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createCasesChartData(counties[name]),
    }
  })

  return (
    <div>
      {selectedCounties.length > 0 && (
        <ChartWithLegend
          name="New Cases (7-Day Moving Average) by County"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedCounties}
        />
      )}
    </div>
  )
}

export default RollingAverageCasesChart
