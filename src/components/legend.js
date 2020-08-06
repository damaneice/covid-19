import React from "react"

const Legend = ({ name, fill }) => {
  return (
    <div style={{ display: "inline-block", marginRight: "10px" }}>
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
    </div>
  )
}

export default Legend
