import React from "react"
import Axis from "./axis"

const svgHeight = 300
const svgWidth = 700

const getMinX = data => {
  return data[0].x
}
const getMaxX = data => {
  return data[data.length - 1].x
}

const getMinY = data => {
  return data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y)
}

const getMaxY = data => {
  return data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y)
}
// GET SVG COORDINATES
const getSvgX = (data, x) => {
  return (x / getMaxX(data)) * svgWidth
}

const getSvgY = (data, y) => {
  return svgHeight - (y / getMaxY(data)) * svgHeight
}

const makeAxis = data => {
  const minX = getMinX(data),
    maxX = getMaxX(data)
  const minY = getMinY(data),
    maxY = getMaxY(data)

  return (
    <g className="linechart_axis">
      <line
        x1={getSvgX(data, minX)}
        y1={getSvgY(data, minY)}
        x2={getSvgX(data, maxX)}
        y2={getSvgY(data, minY)}
      />
      <line
        x1={getSvgX(data, minX)}
        y1={getSvgY(data, minY)}
        x2={getSvgX(data, minX)}
        y2={getSvgY(data, maxY)}
      />
    </g>
  )
}
// BUILD SVG PATH
const makePath = (color, data) => {
  let pathD =
    "M " + getSvgX(data, data[0].x) + " " + getSvgY(data, data[0].y) + " "

  pathD += data.map((point, i) => {
    return "L " + getSvgX(data, point.x) + " " + getSvgY(data, point.y) + " "
  })

  return <path className="linechart_path" d={pathD} style={{ stroke: color }} />
}

const LineChart = ({ data, color }) => (
  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
    {makePath(color, data)}
    {makeAxis(data)}
  </svg>
)
export default LineChart
