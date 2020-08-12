import React, { useState } from "react"

import * as d3 from "d3"
import { graphql } from "gatsby"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSort } from "@fortawesome/free-solid-svg-icons"
import Layout from "../components/layout"
import LineChart from "../components/chart/linechart"
import SEO from "../components/seo"
import "./home.css"

const createChartData = (county, showCases) => {
  const chartData = []
  let subset = []
  for (let i = 0; i < county.chart.length; i++) {
    subset.push(county.chart[i])
    if ((i + 1) % 7 === 0) {
      let total = subset.reduce(
        (acc, current) => acc + (showCases ? current.cases : current.deaths),
        0
      )

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

const sortByCountyName = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.name > b.name) {
      return descendingOrder ? -1 : 1
    }
    if (b.name > a.name) {
      return descendingOrder ? 1 : -1
    }
    return 0
  })
  setCounties([...counties])
  setDescendingOrder(!descendingOrder)
}

const sortByDeaths = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.deaths > b.deaths) {
      return descendingOrder ? -1 : 1
    }
    if (b.deaths > a.deaths) {
      return descendingOrder ? 1 : -1
    }
    return 0
  })
  setCounties([...counties])
  setDescendingOrder(!descendingOrder)
}

const sortByCases = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.cases > b.cases) {
      return descendingOrder ? -1 : 1
    }
    if (b.cases > a.cases) {
      return descendingOrder ? 1 : -1
    }
    return 0
  })
  setCounties([...counties])
  setDescendingOrder(!descendingOrder)
}

const sortByNewCases = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.newCases > b.newCases) {
      return descendingOrder ? -1 : 1
    }
    if (b.newCases > a.newCases) {
      return descendingOrder ? 1 : -1
    }
    return 0
  })
  setCounties([...counties])
  setDescendingOrder(!descendingOrder)
}

const sortByNewDeaths = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.newDeaths > b.newDeaths) {
      return descendingOrder ? -1 : 1
    }
    if (b.newDeaths > a.newDeaths) {
      return descendingOrder ? 1 : -1
    }
    return 0
  })
  setCounties([...counties])
  setDescendingOrder(!descendingOrder)
}

const transformerCountyData = edges => {
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].cases = edge.node.cases
      counties[edge.node.county].newCases = edge.node.newCases
      counties[edge.node.county].deaths = edge.node.deaths
      counties[edge.node.county].newDeaths = edge.node.newDeaths
      counties[edge.node.county].chart.push({
        cases: edge.node.newCases,
        deaths: edge.node.newDeaths,
        date: edge.node.date,
      })
    } else {
      counties[edge.node.county] = {
        cases: 0,
        newCases: 0,
        deaths: 0,
        newDeaths: 0,
        chart: [],
      }
    }
  })
  const countiesArray = Object.keys(counties).map(county => {
    return {
      name: county,
      newCases: counties[county].newCases,
      cases: counties[county].cases,
      newDeaths: counties[county].newDeaths,
      deaths: counties[county].deaths,
      chart: counties[county].chart,
    }
  })
  return countiesArray.sort((a, b) => b.cases - a.cases)
}

const CountiesHeader = ({ counties, setCounties, showCases }) => {
  const [descendingOrder, setDescendingOrder] = useState(false)
  return (
    <>
      <div key="select-county" className="table-header">
        <p>Select</p>
      </div>
      <div key="county-header" className="table-header">
        <button
          onClick={() => {
            sortByCountyName(
              descendingOrder,
              setDescendingOrder,
              counties,
              setCounties
            )
          }}
        >
          COUNTY
          <FontAwesomeIcon className="ml-2" icon={faSort} />
        </button>
      </div>
      <div key="total-header" className="table-header">
        <button
          onClick={() => {
            showCases
              ? sortByCases(
                  descendingOrder,
                  setDescendingOrder,
                  counties,
                  setCounties
                )
              : sortByDeaths(
                  descendingOrder,
                  setDescendingOrder,
                  counties,
                  setCounties
                )
          }}
        >
          TOTAL
          <FontAwesomeIcon className="ml-2" icon={faSort} />
        </button>
      </div>
      <div key="new-cases-header" className="table-header">
        <button
          onClick={() => {
            showCases
              ? sortByNewCases(
                  descendingOrder,
                  setDescendingOrder,
                  counties,
                  setCounties
                )
              : sortByNewDeaths(
                  descendingOrder,
                  setDescendingOrder,
                  counties,
                  setCounties
                )
          }}
        >
          NEW
          <FontAwesomeIcon className="ml-2" icon={faSort} />
        </button>
      </div>
      <div key="chart-header" className="chart-header table-header">
        <p>7 DAY ROLLING AVERAGE</p>
      </div>
    </>
  )
}
const CountyRow = ({ county, add, remove, showCases }) => {
  const [checked, setChecked] = useState(false)
  return (
    <>
      <div className="table-data table-cell">
        <p>
          <input
            className="checkbox"
            type="checkbox"
            checked={checked}
            onChange={event => {
              event.target.checked ? add(county.name) : remove(county.name)
              setChecked(event.target.checked)
            }}
          />
        </p>
      </div>
      <div className="table-data table-cell">
        <p>{county.name}</p>
      </div>
      <div className="table-data table-cell">
        <p>{showCases ? county.cases : county.deaths}</p>
      </div>
      <div className="table-data table-cell">
        <p>{showCases ? county.newCases : county.newDeaths}</p>
      </div>
      <div className="table-cell table-chart">
        <LineChart
          color={"#2196F3"}
          data={createChartData(county, showCases)}
        />
      </div>
    </>
  )
}

const IndexPage = ({ data }) => {
  const defaultSelected = ["Michigan"]
  const [selectedCounties, setSelectedCounties] = useState(defaultSelected)

  const add = countyIndex =>
    setSelectedCounties([...selectedCounties, countyIndex])

  const remove = countyIndex => {
    const index = selectedCounties.indexOf(countyIndex)
    setSelectedCounties([
      ...selectedCounties.slice(0, index),
      ...selectedCounties.slice(index + 1),
    ])
  }
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const [counties, setCounties] = useState(transformerCountyData(edges))
  const updatedDate = edges[edges.length - 1].node.date
  const [showCases, setShowCases] = useState(true)
  const [showDeaths, setShowDeaths] = useState(false)

  return (
    <Layout>
      <SEO title="Home" />
      <div className="container">
        <h3 className="page-title">Select Counties to Compare </h3>
        <div className="updated-date">
          <p>Updated {moment(updatedDate).format("dddd, MMMM Do, YYYY")}</p>
        </div>
        <div className="filter-button-container">
          <button
            className={`filter-button-button ${showCases ? "active" : ""}`}
            onClick={() => {
              setShowCases(true)
              setShowDeaths(false)
            }}
          >
            CASES
          </button>
          <button
            className={`filter-button-button ${showDeaths ? "active" : ""}`}
            onClick={() => {
              setShowCases(false)
              setShowDeaths(true)
            }}
          >
            DEATHS
          </button>
        </div>
        <div className="table">
          <CountiesHeader
            counties={counties}
            setCounties={setCounties}
            showCases={showCases}
          />
          {counties.map(county => {
            return (
              <CountyRow
                key={`${county.name}-row`}
                county={county}
                add={add}
                remove={remove}
                showCases={showCases}
              />
            )
          })}
        </div>
      </div>

      {JSON.stringify(selectedCounties) !== JSON.stringify(defaultSelected) && (
        <div id="footer">
          <div id="inner">
            <a
              className="compare_button"
              href={`/compare?selection=${selectedCounties.join()}`}
            >
              Compare
            </a>
          </div>
        </div>
      )}
    </Layout>
  )
}

export const query = graphql`
  query HomepageQuery {
    allCasesByCountyAndDateCsvSheet1 {
      edges {
        node {
          county
          cases
          deaths
          date(formatString: "Y-MM-DD")
          newCases
          newDeaths
        }
      }
    }
  }
`

export default IndexPage
