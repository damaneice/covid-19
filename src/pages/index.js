import React from "react"

import { graphql } from "gatsby"
import Layout from "../components/layout"
import LineChart from "../components/linechart"
import SEO from "../components/seo"
import "./home.css"

const createChartData = (county, counties) => {
  const chartData = []
  let subset = []
  for(let i = 0; i < counties[county].chart.length; i++){
    subset.push(counties[county].chart[i])
    if ((i + 1) % 7 === 0) {
      let total = subset.reduce((acc, current) => acc + current.cases, 0);
      chartData.push(total / subset.length);
      subset = []
    }
  }
  return chartData.map((y, index) => {
    return {"x": index, "y": y}
  })
}

const transformerCountyData = (edges) => {
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.COUNTY]) {
      counties[edge.node.COUNTY].total = counties[edge.node.COUNTY].total + parseInt(edge.node.Cases)
      counties[edge.node.COUNTY].newCases = edge.node.Cases
      counties[edge.node.COUNTY].chart.push({"cases": edge.node.Cases, "date": edge.node.Date })
    }
    else {
      counties[edge.node.COUNTY] = {newCases: 0, total: 0, chart: []}
    }
  })
  return counties
}
const CountyRow = ({ county, counties}) => {
  return (
    <>
      <div className="table-data table-cell"><p>{county}</p></div>
      <div className="table-data table-cell"><p>{counties[county].total}</p></div>
      <div className="table-data table-cell"><p>{counties[county].newCases}</p></div>
      <div className="table-cell table-chart"><LineChart color={"#2196F3"} data={createChartData(county, counties)}/></div>
    </>
  )

}

const IndexPage = ({ data }) => {
  const { edges } = data.allCasesByCountyAndDateXlsxData

  const counties = transformerCountyData(edges)
  return (
    <Layout>
      <SEO title="Home" />
      <div className="container">
        <div className="table">
          <div key="county-header" className="table-header">COUNTY</div>
          <div key="total-header" className="table-header">TOTAL</div>
          <div key="new-cases-header" className="table-header">NEW</div>
          <div key="chart-header" className="table-header">7 DAY TREND</div>
          {
            Object.keys(counties).map(county => {
              return <CountyRow key={`${county}-row`} county={county} counties={counties}/>
            })
          }
        </div>
      </div>
    </Layout>
  )
}


export const query = graphql`
  query HomepageQuery {
    allCasesByCountyAndDateXlsxData(filter: {CASE_STATUS: {ne: "Probable"}}) {
      edges {
        node {
          COUNTY
          Cases
          Date
          CASE_STATUS
        }
      }
    }
  }
`

export default IndexPage
