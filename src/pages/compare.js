import React from "react"

import TotalCasesChart from "../components/chart/totalCasesChart"
import DailyCasesChart from "../components/chart/dailyCasesChart"
import CasesPer100kChart from "../components/chart/casesPer100KChart"
import DailyDeathsChart from "../components/chart/dailyDeathsChart"
import RollingAverageCasesChart from "../components/chart/rollingAverageCasesChart"
import NewCasesPercentageChart from "../components/chart/newCasesPercentageChart"
import TotalCasesPercentageChart from "../components/chart/totalCasesPercentageChart"
import PositivityChart from "../components/chart/positivityChart"
import {
  countyCaseDataTransformer,
  countyCasePer100KDataTransformer,
  stateCaseDataTransformer,
  stateCasePer100KDataTransformer
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

const updatedDateForCasesPer100k = data => {
  const edges = data.allCasesByCountyAndDatePer100KCsvSheet1.edges
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
  const countiesPer100K = countyCasePer100KDataTransformer(data)
  const state = stateCaseDataTransformer(data)
  const statePer100K = stateCasePer100KDataTransformer(data)
  const selectedNames = result.selection ? result.selection.split(",") : []
  const keys = { ...counties, ...state }
  const keysPer100K = { ...countiesPer100K, ...statePer100K }

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
        <CasesPer100kChart
          updatedDate={updatedDateForCasesPer100k(data)}
          counties={keysPer100K}
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
    allCasesByCountyAndDatePer100KCsvSheet1 {
      edges {
        node {
          county
          cases_avg_per_100k
          date(formatString: "Y-MM-DD")
          deaths_avg_per_100k
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
    allStateCasesByDatePer100KCsvSheet1 {
      edges {
        node {
          state
          cases_avg_per_100k
          date(formatString: "Y-MM-DD")
          deaths_avg_per_100k
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
