import React, { useState } from "react"

const ButtonLegend = ({ children, toggleCounty }) => {
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
        background: "transparent",
        cursor: "pointer",
        display: "inline-block",
      }}
    >
      {children}
    </button>
  )
}

const DefaultLegend = ({ name, fill }) => {
  return (
    <>
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
    </>
  )
}

const Legend = ({ name, fill, toggleCounty }) => {
  return (
    <>
      {toggleCounty ? (
        <ButtonLegend toggleCounty={toggleCounty}>
          <DefaultLegend name={name} fill={fill} />
        </ButtonLegend>
      ) : (
        <DefaultLegend name={name} fill={fill} />
      )}
    </>
  )
}

export default Legend
