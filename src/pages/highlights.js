import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import CaseRateMap from "../components/caseRateMap"
import TotalCasesMap from "../components/totalCasesMap"
import moment from "moment"
import SEO from "../components/seo"
import "./home.css"
import "./highlights.css"

const updatedDate = data => {
  const edges = data.allCasesByCountyAndDateCsvSheet1.edges
  return edges[edges.length - 1].node.date
}

const percentOfChange = (newvalue, previousValue) => {
  const change = newvalue - previousValue
  return (change / newvalue) * 100 || 0
}

const countyCaseDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const counties = {}

  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].previousCases =
        counties[edge.node.county].newCases

      counties[edge.node.county].newCases = edge.node.newCases
      counties[edge.node.county].percentOfDailyCasesChange = percentOfChange(
        edge.node.newCases,
        counties[edge.node.county].previousCases
      )
      counties[edge.node.county].previousDeaths =
        counties[edge.node.county].newDeaths

      counties[edge.node.county].newDeaths = edge.node.newDeaths
      counties[edge.node.county].percentOfDailyDeathsChange = percentOfChange(
        edge.node.newDeaths,
        counties[edge.node.county].previousDeaths
      )
      counties[edge.node.county].cases = edge.node.cases
      counties[edge.node.county].deaths = edge.node.deaths
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

const computeStateFigures = data => {
  const mostRecent = data.allStateCasesByDateCsvSheet1.edges[0].node
  const previous = data.allStateCasesByDateCsvSheet1.edges[1].node
  const changeOfCases = mostRecent.newCases - previous.newCases
  const changeOfDeaths = mostRecent.newDeaths - previous.newDeaths
  const percentOfCasesChange = percentOfChange(
    mostRecent.newCases,
    previous.newCases
  )
  const percentOfDeathsChange = percentOfChange(
    mostRecent.newDeaths,
    previous.newDeaths
  )
  return {
    changeOfCases,
    changeOfDeaths,
    percentOfCasesChange,
    percentOfDeathsChange,
    deaths: mostRecent.deaths,
    newDeaths: mostRecent.newDeaths,
    cases: mostRecent.cases,
    newCases: mostRecent.newCases,
  }
}

const computeCountyFigures = counties => {
  const countyNames = Object.keys(counties)
  let highlighedCountyName = countyNames[0]
  countyNames.forEach(name => {
    if (
      counties[name].changeOfCases >
      counties[highlighedCountyName].changeOfCases
    ) {
      highlighedCountyName = name
    }
  })
  const county = counties[highlighedCountyName]
  return {
    name: highlighedCountyName,
    changeOfCases: county.newCases - county.previousCases,
    changeOfDeaths: county.newDeaths - county.previousDeaths,
    percentOfCasesChange: county.percentOfDailyCasesChange,
    percentOfDeathsChange: county.percentOfDailyDeathsChange,
    deaths: county.deaths,
    newDeaths: county.newDeaths,
    cases: county.cases,
    newCases: county.newCases,
  }
}

const StatsSection = props => {
  const { data, name } = props
  return (
    <>
      <div className="stats-section-name">
        <h4>{name}</h4>
      </div>
      <div className="state-figures">
        <div className="figures-cell figures-header">
          <p>CASES</p>
        </div>
        <div className="figures-cell figures-cases">
          <p>{data.cases}</p>
        </div>
        <div className="figures-cell figures-header border-top">
          <p style={{ paddingTop: "12px" }}>NEW CASES</p>
        </div>
        <div className="figures-cell figures-cases border-top">
          <p>{data.newCases}</p>
          <p
            className={
              data.changeOfCases >= 0 ? "percent-increase" : "percent-decrease"
            }
          >
            <span>{data.changeOfCases >= 0 ? "+" : "-"}</span>
            {data.percentOfCasesChange.toFixed(1)}%
          </p>
        </div>
        <div className="figures-cell figures-header border-top">
          <p>DEATHS</p>
        </div>
        <div className="figures-cell figures-deaths border-top">
          <p>{data.deaths}</p>
        </div>
        <div className="figures-cell figures-header border-top">
          <p style={{ paddingTop: "12px" }}>NEW DEATHS</p>
        </div>
        <div className="figures-cell figures-deaths border-top">
          <p>{data.newDeaths}</p>
          <p
            className={
              data.changeOfDeaths >= 0 ? "percent-increase" : "percent-decrease"
            }
          >
            <span>{data.changeOfDeaths >= 0 ? "+" : "-"}</span>
            {data.percentOfDeathsChange.toFixed(1)}%
          </p>
        </div>
      </div>
    </>
  )
}

const HighlightsPage = ({ data }) => {
  const counties = countyCaseDataTransformer(data)
  const [showCaseRate, setShowCaseRate] = useState(true)
  const [showTotalCases, setShowTotalCases] = useState(false)
  const stateFigures = computeStateFigures(data)
  const countyFigures = computeCountyFigures(counties)

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
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
        <StatsSection data={stateFigures} name={"State Figures"} />
        <StatsSection
          data={countyFigures}
          name={`${countyFigures.name} County has the highest increase`}
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
          cases
          deaths
          newCases
          newDeaths
          date(formatString: "Y-MM-DD")
        }
      }
    }
    allStateCasesByDateCsvSheet1(
      limit: 2
      sort: { order: DESC, fields: date }
    ) {
      edges {
        node {
          cases
          deaths
          newCases
          newDeaths
          date
        }
      }
    }
  }
`

export default HighlightsPage
