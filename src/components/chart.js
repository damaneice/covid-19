import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const stringToColour = name => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }
  return color
}

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

const Chart = ({ data, margin }) => {
  const svgWidth = 600,
    height = 220
  const divRef = useRef()
  const svgRef = useRef()

  useEffect(() => {
    var svgElement = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", svgWidth + margin.left)
      .attr("height", height + margin.bottom)
      .attr("style", "display: block")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data[0].values, function (d) {
          return d.date
        })
      )
      .range([0, svgWidth - margin.right])

    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 12)

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data
            .map(county => {
              return county.values
            })
            .flat(),
          function (d) {
            return +d.y
          }
        ),
      ])
      .range([height, 0])
    var svgAxisY = d3.select(svgRef.current)
    svgAxisY
      .attr("height", height + margin.bottom)
      .attr("class", "chart_width")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.axisLeft(y).tickSizeOuter(0))

    data.forEach(county => {
      svgElement
        .append("path")
        .datum(county.values)
        .attr("fill", "none")
        .attr("stroke", stringToColour(county.name))
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date)
            })
            .y(function (d) {
              return y(d.y)
            })
        )
    })
  }, [data, margin])

  return (
    <div>
      <div>
        {data.map(county => {
          const color = stringToColour(county.name)
          return <Legend key={color} name={county.name} fill={color} />
        })}
      </div>
      <div className="compare_chart chart_width">
        <svg
          style={{ position: "absolute", pointerEvents: "none", zIndex: 1 }}
          ref={svgRef}
        ></svg>
        <div style={{ overflowX: "scroll" }} ref={divRef}></div>
      </div>
    </div>
  )
}

export default Chart
