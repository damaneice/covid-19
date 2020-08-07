/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "avenir",
        }}
      >
        <main>{children}</main>
      </div>
      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "avenir",
          marginBottom: "5px",
        }}
      >
        <span style={{ textAlign: "center", marginBottom: "25px" }}>
          Data taken from the
          <a
            style={{ marginLeft: "4px", marginRight: "4px" }}
            href="https://www.michigan.gov/coronavirus"
          >
            MDHHS Coronavirus website.
          </a>
          and the
          <a
            style={{ marginLeft: "4px" }}
            href="https://github.com/nytimes/covid-19-data"
          >
            NYT GitHub repository.
          </a>
        </span>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
