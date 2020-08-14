import React from "react"
import * as d3 from "d3"
import ChartWithLegend from "./chartWithLegend"

const groupStateCasesByDate = state => {
  const groupeByDate = {}
  state.chart.forEach(caseRecord => {
    groupeByDate[caseRecord.date] = caseRecord
  })
  return groupeByDate
}

const createCasesChartData = (county, stateCasesGroupedByDate) => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    const countyCasesDate = county.chart[i].date
    const statesNewCases = stateCasesGroupedByDate[countyCasesDate].newCases
    chartData.push({
      x: i,
      y: (county.chart[i].newCases / statesNewCases) * 100 || 0,
      date: d3.timeParse("%Y-%m-%d")(countyCasesDate),
    })
  }
  return chartData
}

const NewCasesPercentageChart = ({ counties, selectedNames, updatedDate }) => {
  const stateCasesGroupedByDate = groupStateCasesByDate(counties["Michigan"])
  const selectedCounties = selectedNames.map(name => {
    return {
      name: name,
      values: createCasesChartData(counties[name], stateCasesGroupedByDate),
    }
  })

  return (
    <div>
      {selectedCounties.length > 0 && (
        <ChartWithLegend
          name="Percentage of State's New Cases"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedCounties}
          updatedDate={updatedDate}
        />
      )}
    </div>
  )
}

export default NewCasesPercentageChart
