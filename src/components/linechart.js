
import React from "react"
const svgHeight = 300
const svgWidth = 700

  const getMaxX = (data) => {
    return data[data.length - 1].x;
  }

  const getMaxY = (data) => {
    return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
  }
  // GET SVG COORDINATES
  const getSvgX = (data, x) => {
    return (x / getMaxX(data) * svgWidth);
  }

  const getSvgY = (data, y) => {
    return svgHeight - (y / getMaxY(data) * svgHeight);
  }
  // BUILD SVG PATH
  const makePath = (color, data) => {
    let pathD = "M " + getSvgX(data, data[0].x) + " " + getSvgY(data, data[0].y) + " ";

    pathD += data.map((point, i) => {
      return "L " + getSvgX(data, point.x) + " " + getSvgY(data, point.y) + " ";
    });

    return (
      <path className="linechart_path" d={pathD} style={{stroke: color}} />
    );
  }


const LineChart = ({ data, color }) => (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
    {makePath(color, data)}
    </svg>
)
export default LineChart
