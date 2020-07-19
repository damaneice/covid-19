import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const Chart = ({ data, margin }) => {
  const width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom
  const ref = useRef()

  useEffect(() => {
    var svgElement = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date
        })
      )
      .range([0, width])

    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 10)

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.y
        }),
      ])
      .range([height, 0])
    svgElement.append("g").call(d3.axisLeft(y).tickSizeOuter(0))

    svgElement
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
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
  }, [data, margin.left, margin.top])

  return <div ref={ref} />
}

export default Chart
