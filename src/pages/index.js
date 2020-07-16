import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./home.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div class="container">
      <div class="table">
        <div class="table-header">COUNTY</div>
        <div class="table-header">TOTAL</div>
        <div class="table-header">NEW</div>
        <div class="table-header">7 DAY TREND</div>
        <div class="table-cell">Oakland</div>
        <div class="table-cell">B</div>
        <div class="table-cell">C</div>
        <div class="table-cell">D</div>
        <div class="table-cell">E</div>
        <div class="table-cell">F</div>
        <div class="table-cell">G</div>
        <div class="table-cell">H</div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
