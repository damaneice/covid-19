import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const Chart = ({
  data,
  height,
  width,
  margin = { left: 0, right: 0, top: 0, bottom: 0 },
}) => {
  const ref = useRef()

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement
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
      .call(d3.axisBottom(x))

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.y
        }),
      ])
      .range([height, 0])
    svgElement.append("g").call(d3.axisLeft(y))

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
  }, [])

  return <svg viewBox={`0 0 ${width} ${height}`} ref={ref} />
}

export default Chart
