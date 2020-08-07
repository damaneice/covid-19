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

const createPositivityChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      x: i,
      y: county.chart[i].positivityPercent,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }
  return chartData
}

// percentage of tests that were positive
const positiveTestPercentageTransformer = edges => {
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.COUNTY]) {
      counties[edge.node.COUNTY].chart.push({
        positivityPercent: (edge.node.Positive / edge.node.Total) * 100,
        date: edge.node.MessageDate,
      })
    } else {
      counties[edge.node.COUNTY] = { chart: [] }
    }
  })
  return counties
}

const PositivityChart = ({ edges, counties, selectedNames }) => {
  const countiesPositivity = positiveTestPercentageTransformer(edges)
  const countyNamesMapping = {
    "St. Clair": "St Clair",
    "St. Joseph": "St Joseph",
  }

  const selectedRollingAverageCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createCasesChartData(counties[name]),
    }
  })
  const selectedCounties = selectedRollingAverageCounties.map(county => {
    const nameFix = countyNamesMapping[county.name] || county.name
    return {
      name: nameFix,
      values: createPositivityChartData(countiesPositivity[nameFix]),
    }
  })

  return (
    <div>
      {selectedCounties.length > 0 && (
        <ChartWithLegend
          name="Percentage of Tests That Were Positive"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedCounties}
        />
      )}
    </div>
  )
}

export default PositivityChart
