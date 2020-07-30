import React from "react"

import Chart from "../components/chart"
import * as d3 from "d3"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import "./home.css"

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
  const { edges } = data.allCasesByCountyAndDateXlsxData
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.COUNTY]) {
      counties[edge.node.COUNTY].total =
        counties[edge.node.COUNTY].total + parseInt(edge.node.Cases)
      counties[edge.node.COUNTY].newCases = edge.node.Cases
      counties[edge.node.COUNTY].chart.push({
        cases: edge.node.Cases,
        date: edge.node.Date,
      })
    } else {
      counties[edge.node.COUNTY] = { newCases: 0, total: 0, chart: [] }
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

const ComparePage = ({ data }) => {
  const location = useLocation()
  const result = queryString.parse(location.search)
  const counties = countyCaseDataTransformer(data)
  const countiesPositivity = positiveTestPercentageTransformer(data)
  const selectedCountyNames = result.selection
    ? result.selection.split(",")
    : []
  const selectedCounties = selectedCountyNames.map(name => {
    return {
      name: name,
      values: createCaseChartData(counties[name]),
    }
  })

  const selectedPositivityCounties = selectedCounties.map(county => {
    return {
      name: county.name,
      values: creatPositivityChartData(countiesPositivity[county.name]),
    }
  })

  return (
    <Layout>
      <SEO title="Home" />
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "avenir",
        }}
      >
        {selectedCounties.length > 0 && (
          <Chart
            name="New Cases (7-Day Moving Average)"
            margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
            data={selectedCounties}
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
    allCasesByCountyAndDateXlsxData(
      filter: { COUNTY: { ne: "MDOC" }, CASE_STATUS: { ne: "Probable" } }
    ) {
      edges {
        node {
          COUNTY
          Cases
          Date(formatString: "Y-MM-DD")
          CASE_STATUS
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
