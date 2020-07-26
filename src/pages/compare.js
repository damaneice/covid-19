import React from "react"

import Chart from "../components/chart"
import * as d3 from "d3"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import "./home.css"

const createChartData = county => {
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

const transformerCountyData = edges => {
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
  const countiesArray = Object.keys(counties).map(county => {
    return {
      name: county,
      newCases: counties[county].newCases,
      total: counties[county].total,
      chart: counties[county].chart,
    }
  })
  return countiesArray.sort((a, b) => b.total - a.total)
}
const ComparePage = ({ data }) => {
  const location = useLocation()
  const result = queryString.parse(location.search)

  const { edges } = data.allCasesByCountyAndDateXlsxData
  const counties = transformerCountyData(edges)
  const selectedIndexes = result.selection ? result.selection.split(",") : [0]
  const selectedCounties = selectedIndexes.map(index => {
    return {
      name: counties[index].name,
      values: createChartData(counties[index]),
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
        <Chart
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={selectedCounties}
        />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query CompareQuery {
    allCasesByCountyAndDateXlsxData(
      filter: { CASE_STATUS: { ne: "Probable" } }
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
  }
`

export default ComparePage
