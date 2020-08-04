import React from "react"

import Layout from "../components/layout"
import Map from "../components/map"
import SEO from "../components/seo"
import "./home.css"

const countyCaseDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].newCases.push(parseInt(edge.node.newCases))
    } else {
      counties[edge.node.county] = { rateOfChange: 0, newCases: [] }
    }
  })
  Object.keys(counties).forEach(county => {
    //last 14 elements
    const mostRecent = counties[county].newCases.slice(-14)
    const previousRollingCases = []
    const currentRollingCases = []
    mostRecent.forEach((cases, index) => {
      if (index < 7) {
        previousRollingCases.push(cases)
      } else {
        currentRollingCases.push(cases)
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
  return (
    <Layout>
      <SEO title="Highlights" />
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "avenir",
        }}
      >
        <Map
          counties={counties}
          name="Michigan"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
        />
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
          newCases
        }
      }
    }
  }
`

export default HighlightsPage
