import React from "react"

import Layout from "../components/layout"
import LineChart from "../components/linechart"
import SEO from "../components/seo"
import "./home.css"

const createFakeData = () => {
  // This function creates data that doesn't look entirely random
  const data = []

  for (let x = 0; x <= 30; x++) {
    const random = Math.random();
    const temp = data.length > 0 ? data[data.length-1].y : 50;
    const y = random >= .45 ? temp + Math.floor(random * 20) : temp - Math.floor(random * 20);
    data.push({x,y})
  }
  return data;
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div class="container">
      <div class="table">
        <div class="table-header">COUNTY</div>
        <div class="table-header">TOTAL</div>
        <div class="table-header">NEW</div>
        <div class="table-header">7 DAY TREND</div>
        <div class="table-data table-cell"><p>Oakland</p></div>
        <div class="table-data table-cell"><p>13</p></div>
        <div class="table-data table-cell"><p>22</p></div>
        <div class="table-cell table-chart"><LineChart color={"#2196F3"} data={createFakeData()}/></div>
        <div class="table-data table-cell"><p>Wayne</p></div>
        <div class="table-data table-cell"><p>45</p></div>
        <div class="table-data table-cell"><p>23</p></div>
        <div class="table-cell table-chart"><LineChart color={"#2196F3"} data={createFakeData()}/></div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
