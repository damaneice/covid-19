import React, { useState } from "react"

const Legend = ({ name, fill, toggleCounty }) => {
  const [active, setActive] = useState(true)
  return (
    <button
      className={`chart-legend ${active ? "" : "unselected"}`}
      onClick={() => {
        if (toggleCounty(active)) {
          setActive(!active)
        }
      }}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "inline-block",
        marginRight: "10px",
      }}
    >
      <svg
        width="15"
        height="15"
        style={{ display: "inline-block", verticalAlign: "middle" }}
      >
        <rect
          width="15"
          height="15"
          style={{
            fill: fill,
          }}
        />
        Sorry, your browser does not support inline SVG.
      </svg>
      <span
        style={{
          marginLeft: "5px",
          verticalAlign: "middle",
          display: "inline-block",
        }}
      >
        {name}
      </span>
    </button>
  )
}

export default Legend
