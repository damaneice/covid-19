import React from "react"

import TotalCasesChart from "../components/totalCasesChart"
import DailyCasesChart from "../components/dailyCasesChart"
import DailyDeathsChart from "../components/dailyDeathsChart"
import RollingAverageCasesChart from "../components/rollingAverageCasesChart"
import PositivityChart from "../components/positivityChart"
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

const updatedDate = data => {
  const edges = data.allCasesByCountyAndDateCsvSheet1
    ? data.allCasesByCountyAndDateCsvSheet1.edges
    : data.allDiagnosticTestsByResultAndCountyXlsxData.edges
  return edges[edges.length - 1].node.date
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
          counties={keys}
          selectedNames={selectedNames}
        />
        <div className="updated-date">
          <p>
            Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}
          </p>
        </div>
        <DailyCasesChart counties={keys} selectedNames={selectedNames} />
        <div className="updated-date">
          <p>
            Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}
          </p>
        </div>
        <DailyDeathsChart counties={keys} selectedNames={selectedNames} />
        <div className="updated-date">
          <p>
            Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}
          </p>
        </div>
        <TotalCasesChart counties={keys} selectedNames={selectedNames} />
        <div className="updated-date">
          <p>
            Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}
          </p>
        </div>
        <PositivityChart
          edges={data.allDiagnosticTestsByResultAndCountyXlsxData.edges}
          counties={keys}
          selectedNames={selectedNames.filter(name => name !== "Michigan")} //remove Michigan from Positivity Chart
        />
        <div className="updated-date">
          <p>
            Updated {moment(updatedDate(data)).format("dddd, MMMM Do, YYYY")}
          </p>
        </div>
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
