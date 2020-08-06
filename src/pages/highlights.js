import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import CaseRateMap from "../components/caseRateMap"
import TotalCasesMap from "../components/totalCasesMap"
import moment from "moment"
import SEO from "../components/seo"
import "./home.css"

const updatedDate = data => {
  const edges = data.allCasesByCountyAndDateCsvSheet1.edges
  return edges[edges.length - 1].node.date
}

const countyCaseDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].cases = edge.node.cases
      counties[edge.node.county].name = edge.node.county
      counties[edge.node.county].chart.push({
        newCases: parseInt(edge.node.newCases),
        cases: parseInt(edge.node.cases),
        date: edge.node.date,
      })
    } else {
      counties[edge.node.county] = {
        rateOfChange: 0,
        cases: 0,
        chart: [{ newCases: 0, cases: 0 }],
      }
    }
  })
  Object.keys(counties).forEach(county => {
    //last 14 elements
    const mostRecent = counties[county].chart.slice(0).slice(-14)
    const previousRollingCases = []
    const currentRollingCases = []
    mostRecent.forEach((item, index) => {
      if (index < 7) {
        previousRollingCases.push(item.newCases)
      } else {
        currentRollingCases.push(item.newCases)
      }
    })
    let previousRollingCasesTotal = previousRollingCases.reduce(
      (acc, current) => acc + current,
      0
    )
    let currentRollingCasesTotal = currentRollingCases.reduce(
      (acc, current) => acc + current,
      0
    )

    const previousRollingAverage =
      previousRollingCasesTotal / previousRollingCases.length || 1
    const currentRollingAverage =
      currentRollingCasesTotal / currentRollingCases.length || 1
    counties[county].rateOfChange =
      100 * (currentRollingAverage / previousRollingAverage - 1)
  })

  return counties
}

const HighlightsPage = ({ data }) => {
  const counties = countyCaseDataTransformer(data)
  const [showCaseRate, setShowCaseRate] = useState(true)
  const [showTotalCases, setShowTotalCases] = useState(false)
  return (
    <Layout>
      <SEO title="Highlights" />
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
        <div style={{ display: showCaseRate ? "block" : "none" }}>
          <CaseRateMap counties={counties} />
        </div>
        <div style={{ display: showTotalCases ? "block" : "none" }}>
          <TotalCasesMap counties={counties} />
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            className={`case-map-button ${showCaseRate ? "active" : ""}`}
            onClick={() => {
              setShowCaseRate(true)
              setShowTotalCases(false)
            }}
          >
            CASE GROWTH RATE
          </button>
          <button
            className={`case-map-button ${showTotalCases ? "active" : ""}`}
            onClick={() => {
              setShowCaseRate(false)
              setShowTotalCases(true)
            }}
          >
            TOTAL CASES
          </button>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query HighlightsQuery {
    allCasesByCountyAndDateCsvSheet1 {
      edges {
        node {
          county
          cases
          newCases
          date(formatString: "Y-MM-DD")
        }
      }
    }
  }
`

export default HighlightsPage
