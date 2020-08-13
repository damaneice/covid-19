import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"

const Header = ({ siteTitle }) => {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <header
      style={{
        marginBottom: `1.45rem`,
      }}
    >
      <div className="header">
        <button
          className="mobile-menu-icon"
          onClick={() => {
            setShowMenu(!showMenu)
          }}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
        <Link
          className="title"
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
          <span className="short-description">COVID-19 Tracker</span>
        </Link>
        <div className="header-right">
          <Link activeClassName="active" to="/">
            Home
          </Link>
          <Link activeClassName="active" to="/highlights">
            Highlights
          </Link>
          <Link activeClassName="active" to="/hospitalizations">
            Hospitalizations
          </Link>
        </div>
        {showMenu && (
          <div>
            <Link activeClassName="active" to="/">
              Home
            </Link>
            <Link activeClassName="active" to="/highlights">
              Highlights
            </Link>
            <Link activeClassName="active" to="/hospitalizations">
              Hospitalizations
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
