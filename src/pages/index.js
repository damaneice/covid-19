import React, { useState } from "react"

import * as d3 from "d3"
import { graphql } from "gatsby"
import moment from "moment"
import Layout from "../components/layout"
import LineChart from "../components/linechart"
import SEO from "../components/seo"
import "./home.css"

const createChartData = county => {
  const chartData = []
  let subset = []
  for (let i = 0; i < county.chart.length; i++) {
    subset.push(county.chart[i])
    if ((i + 1) % 7 === 0) {
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

const sortByTotalCases = (
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties
) => {
  counties.sort((a, b) => {
    if (a.total > b.total) {
      return descendingOrder ? -1 : 1
    }
    if (b.total > a.total) {
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

const transformerCountyData = edges => {
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].total = edge.node.cases
      counties[edge.node.county].newCases = edge.node.newCases
      counties[edge.node.county].chart.push({
        cases: edge.node.newCases,
        date: edge.node.date,
      })
    } else {
      counties[edge.node.county] = { newCases: 0, total: 0, chart: [] }
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

const CountiesHeader = ({ counties, setCounties }) => {
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
        </button>
      </div>
      <div key="total-header" className="table-header">
        <button
          onClick={() => {
            sortByTotalCases(
              descendingOrder,
              setDescendingOrder,
              counties,
              setCounties
            )
          }}
        >
          TOTAL
        </button>
      </div>
      <div key="new-cases-header" className="table-header">
        <button
          onClick={() => {
            sortByNewCases(
              descendingOrder,
              setDescendingOrder,
              counties,
              setCounties
            )
          }}
        >
          NEW
        </button>
      </div>
      <div key="chart-header" className="chart-header table-header">
        <p>7 DAY ROLLING AVERAGE</p>
      </div>
    </>
  )
}
const CountyRow = ({ county, add, remove }) => {
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
        <p>{county.total}</p>
      </div>
      <div className="table-data table-cell">
        <p>{county.newCases}</p>
      </div>
      <div className="table-cell table-chart">
        <LineChart color={"#2196F3"} data={createChartData(county)} />
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
  return (
    <Layout>
      <SEO title="Home" />
      <div className="container">
        <div className="updated-date">
          <p>Updated {moment(updatedDate).format("dddd, MMMM Do, YYYY")}</p>
        </div>
        <div className="table">
          <CountiesHeader counties={counties} setCounties={setCounties} />
          {counties.map(county => {
            return (
              <CountyRow
                key={`${county.name}-row`}
                county={county}
                add={add}
                remove={remove}
              />
            )
          })}
        </div>
      </div>
      {selectedCounties !== defaultSelected && (
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
          date(formatString: "Y-MM-DD")
          newCases
        }
      }
    }
  }
`

export default IndexPage
