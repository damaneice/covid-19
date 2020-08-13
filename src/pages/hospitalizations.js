import React from "react"

import ChartWithLegend from "../components/chart/chartWithLegend"
import * as d3 from "d3"
import { graphql } from "gatsby"
import moment from "moment"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "./home.css"

const updatedDate = data => {
  const edges = data.allCovid19HospitalizationsCsvSheet1.edges
  return moment(edges[edges.length - 1].node["DATE"]).format("MMMM Do")
}

const hospitalizationsTransformer = data => {
  const { edges } = data.allCovid19HospitalizationsCsvSheet1
  const deaths = []
  const edDischarges = []
  const inpatients = []
  const newCases = []
  const ventilators = []
  const criticalCare = []
  edges.forEach(edge => {
    const node = edge.node
    deaths.push({ value: node["Deaths"], date: node["Date"] })
    edDischarges.push({ value: node["ED_Discharges"], date: node["Date"] })
    inpatients.push({ value: node["Inpatients"], date: node["Date"] })
    newCases.push({ value: node["New_Cases"], date: node["Date"] })
    ventilators.push({ value: node["Ventilators"], date: node["Date"] })
    criticalCare.push({ value: node["Critical_Care"], date: node["Date"] })
  })
  return {
    Deaths: deaths,
    "ED Discharges": edDischarges,
    Inpatients: inpatients,
    "New Cases": newCases,
    Ventilators: ventilators,
    "Critical Care": criticalCare,
  }
}

const createChartData = hospitalization => {
  const chartData = []
  for (let i = 0; i < hospitalization.length; i++) {
    chartData.push({
      x: i,
      y: hospitalization[i].value,
      date: d3.timeParse("%Y-%m-%d")(hospitalization[i].date),
    })
  }

  return chartData.map((y, index) => {
    return { x: index, y: y.y, date: y.date }
  })
}

const HospitalizationsPage = ({ data }) => {
  const hospitalizationsTypes = hospitalizationsTransformer(data)
  const hospitalizations = Object.keys(hospitalizationsTypes).map(
    hospitalizationType => {
      return {
        name: hospitalizationType,
        values: createChartData(hospitalizationsTypes[hospitalizationType]),
      }
    }
  )

  return (
    <Layout>
      <SEO title="Hospitalizations" />
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "avenir",
        }}
      >
        <ChartWithLegend
          name="COVID Hospitalizations in Michigan"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
          data={hospitalizations}
          updatedDate={updatedDate(data)}
        />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query HospitalizationsPageQuery {
    allCovid19HospitalizationsCsvSheet1 {
      edges {
        node {
          Date(formatString: "Y-MM-DD")
          Critical_Care
          Deaths
          ED_Discharges
          Inpatients
          New_Cases
          Ventilators
        }
      }
    }
  }
`

export default HospitalizationsPage
