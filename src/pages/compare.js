import React from "react"

import TotalCasesChart from "../components/chart/totalCasesChart"
import DailyCasesChart from "../components/chart/dailyCasesChart"
import DailyDeathsChart from "../components/chart/dailyDeathsChart"
import RollingAverageCasesChart from "../components/chart/rollingAverageCasesChart"
import NewCasesPercentageChart from "../components/chart/newCasesPercentageChart"
import TotalCasesPercentageChart from "../components/chart/totalCasesPercentageChart"
import PositivityChart from "../components/chart/positivityChart"
import {
  countyCaseDataTransformer,
  stateCaseDataTransformer,
} from "../util/dataTransformers"
import { graphql } from "gatsby"
import moment from "moment"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useLocation } from "@reach/router"
import queryString from "query-string"
import "./home.css"

const updatedDateForCases = data => {
  const edges = data.allCasesByCountyAndDateCsvSheet1.edges
  return moment(edges[edges.length - 1].node.date).format("MMMM Do")
}

const updatedDateForPositivityRate = data => {
  const edges = data.allDiagnosticTestsByResultAndCountyXlsxData.edges
  return moment(edges[edges.length - 1].node.date).format("MMMM Do")
}

const ComparePage = ({ data }) => {
  const location = useLocation()
  const result = queryString.parse(location.search)
  const counties = countyCaseDataTransformer(data)
  const state = stateCaseDataTransformer(data)
  const selectedNames = result.selection ? result.selection.split(",") : []
  const keys = { ...counties, ...state }
  return (
    <Layout>
      <SEO title="Compare" />
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
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames}
        />
        <DailyCasesChart
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames}
        />
        <NewCasesPercentageChart
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames.filter(name => name !== "Michigan")} //remove Michigan
        />
        <DailyDeathsChart
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames}
        />
        <TotalCasesChart
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames}
        />
        <TotalCasesPercentageChart
          updatedDate={updatedDateForCases(data)}
          counties={keys}
          selectedNames={selectedNames.filter(name => name !== "Michigan")} //remove Michigan
        />
        <PositivityChart
          updatedDate={updatedDateForPositivityRate(data)}
          edges={data.allDiagnosticTestsByResultAndCountyXlsxData.edges}
          counties={keys}
          selectedNames={selectedNames.filter(name => name !== "Michigan")} //remove Michigan
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
          newDeaths
        }
      }
    }
    allStateCasesByDateCsvSheet1 {
      edges {
        node {
          date(formatString: "Y-MM-DD")
          cases
          newCases
          newDeaths
          state
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
