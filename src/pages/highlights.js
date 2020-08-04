import React from "react"

import Layout from "../components/layout"
import Map from "../components/map"
import SEO from "../components/seo"
import "./home.css"

const HighlightsPage = () => {
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
          name="Michigan"
          margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
        />
      </div>
    </Layout>
  )
}

export default HighlightsPage
