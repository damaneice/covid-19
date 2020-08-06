import React from "react"

import Chart from "../components/chart"
import * as d3 from "d3"
import { graphql } from "gatsby"
import moment from "moment"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import "./home.css"

const createDailyCaseChartData = county => {
  const chartData = []
  for (let i = 0; i < county.chart.length; i++) {
    chartData.push({
      value: county.chart[i].cases,
      date: d3.timeParse("%Y-%m-%d")(county.chart[i].date),
    })
  }

  return chartData.map((y, index) => {
    return { x: index, y: y.value, date: y.date }
  })
}

const createCaseChartData = county => {
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

const creatPositivityChartData = county => {
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

const countyCaseDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].total = parseInt(edge.node.cases)
      counties[edge.node.county].newCases = edge.node.newCases
      counties[edge.node.county].chart.push({
        cases: edge.node.newCases,
        date: edge.node.date,
      })
    } else {
      counties[edge.node.county] = { newCases: 0, total: 0, chart: [] }
    }
  })
  return counties
}
// percentage of tests that were positive
const positiveTestPercentageTransformer = data => {
  const { edges } = data.allDiagnosticTestsByResultAndCountyXlsxData
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

const updatedDate = data => {
  const edges = data.allCasesByCountyAndDateCsvSheet1.edges
  return edges[edges.length - 1].node.date
}

const ComparePage = ({ data }) => {
  const location = useLocation()
  const result = queryString.parse(location.search)
  const counties = countyCaseDataTransformer(data)
  const countiesPositivity = positiveTestPercentageTransformer(data)
  const selectedCountyNames = result.selection
    ? result.selection.split(",")
    : []
  const selectedRollingAverageCounties = selectedCountyNames.map(name => {
    return {
      name: name,
      values: createCaseChartData(counties[name]),
    }
  })

  const selectedDailyCounties = selectedCountyNames.map(name => {
    return {
      name: name,
      values: createDailyCaseChartData(counties[name]),
    }
  })

  const selectedPositivityCounties = selectedRollingAverageCounties.map(
    county => {
      return {
        name: county.name,
        values: creatPositivityChartData(countiesPositivity[county.name]),
      }
    }
  )

  return (
    <Layout>
      <SEO title="Compare" />
      <div className="updated-date">
        <p>Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}</p>
      </div>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "avenir",
        }}
      >
        {selectedRollingAverageCounties.length > 0 && (
          <Chart
            name="New Cases (7-Day Moving Average)"
            margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
            data={selectedRollingAverageCounties}
          />
        )}

        {selectedDailyCounties.length > 0 && (
          <Chart
            name="New Daily Cases"
            margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
            data={selectedDailyCounties}
          />
        )}

        {selectedPositivityCounties.length > 0 && (
          <Chart
            name="Percentage of Tests That Were Positive"
            margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
            data={selectedPositivityCounties}
          />
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CompareQuery {
    allCasesByCountyAndDateCsvSheet1 {
      edges {
        node {
          county
          cases
          date(formatString: "Y-MM-DD")
          newCases
        }
      }
    }
    allDiagnosticTestsByResultAndCountyXlsxData {
      edges {
        node {
          COUNTY
          Total
          Positive
          Negative
          MessageDate(formatString: "Y-MM-DD")
        }
      }
    }
  }
`

export default ComparePage
