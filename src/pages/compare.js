import React from "react"

import TotalCasesChart from "../components/totalCasesChart"
import DailyCasesChart from "../components/dailyCasesChart"
import RollingAverageCasesChart from "../components/rollingAverageCasesChart"
import PositivityChart from "../components/positivityChart"
import { graphql } from "gatsby"
import moment from "moment"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import "./home.css"

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
        totalCases: parseInt(edge.node.cases),
      })
    } else {
      counties[edge.node.county] = { newCases: 0, total: 0, chart: [] }
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

  const selectedCountyNames = result.selection
    ? result.selection.split(",")
    : []

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
        <RollingAverageCasesChart
          counties={counties}
          selectedCountyNames={selectedCountyNames}
        />
        <DailyCasesChart
          counties={counties}
          selectedCountyNames={selectedCountyNames}
        />

        <TotalCasesChart
          counties={counties}
          selectedCountyNames={selectedCountyNames}
        />

        <PositivityChart
          edges={data.allDiagnosticTestsByResultAndCountyXlsxData.edges}
          counties={counties}
          selectedCountyNames={selectedCountyNames}
        />
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
