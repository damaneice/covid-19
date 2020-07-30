import React, { useState } from "react"

import * as d3 from "d3"
import { graphql } from "gatsby"
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

const CountiesHeader = ({
  descendingOrder,
  setDescendingOrder,
  counties,
  setCounties,
}) => {
  return (
    <>
      <div key="select-county" className="table-header">
        Select
      </div>
      <div key="county-header" className="clickable-table-header table-header">
        <button
          href="#"
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
      <div key="total-header" className="clickable-table-header table-header">
        TOTAL
      </div>
      <div
        key="new-cases-header"
        className="clickable-table-header table-header"
      >
        NEW
      </div>
      <div key="chart-header" className="chart-header table-header">
        7 DAY ROLLING AVERAGE
      </div>
    </>
  )
}
const CountyRow = ({ county, index, add, remove }) => {
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
  const [selectedCounties, setSelectedCounties] = useState([])

  const add = countyIndex =>
    setSelectedCounties([...selectedCounties, countyIndex])

  const remove = countyIndex => {
    const index = selectedCounties.indexOf(countyIndex)
    setSelectedCounties([
      ...selectedCounties.slice(0, index),
      ...selectedCounties.slice(index + 1),
    ])
  }
  const { edges } = data.allCasesByCountyAndDateXlsxData
  const [counties, setCounties] = useState(transformerCountyData(edges))
  const [descendingOrder, setDescendingOrder] = useState(false)

  return (
    <Layout>
      <SEO title="Home" />
      <div className="container">
        <div className="table">
          <CountiesHeader
            descendingOrder={descendingOrder}
            setDescendingOrder={setDescendingOrder}
            counties={counties}
            setCounties={setCounties}
          />
          {counties.map((county, index) => {
            return (
              <CountyRow
                index={index}
                key={`${county.name}-row`}
                county={county}
                add={add}
                remove={remove}
              />
            )
          })}
        </div>
      </div>
      {selectedCounties.length > 0 && (
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
    allCasesByCountyAndDateXlsxData(
      filter: { COUNTY: { ne: "MDOC" }, CASE_STATUS: { ne: "Probable" } }
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

export default IndexPage
