import * as d3 from "d3"
import useWindowDimensions from "../hooks/useWindowDimensions"
import React, { useEffect, useRef } from "react"

const Chart = ({ data, margin }) => {
  const { width } = useWindowDimensions()
  const svgWidth = 600,
    height = 250
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
      .range([0, svgWidth])

    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
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

    svgElement
      .append("path")
      .datum(data[0].values)
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

    svgElement
      .append("path")
      .datum(data[1].values)
      .attr("fill", "none")
      .attr("stroke", "green")
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
    const legend = {}
    legend[data[0].name] = "steelblue"
    legend[data[1].name] = "green"

    var lineLegend = svgElement
      .selectAll(".lineLegend")
      .data(Object.keys(legend))
      .enter()
      .append("g")
      .attr("class", "lineLegend")
      .attr("transform", function (d, i) {
        return "translate(" + margin.left + "," + i * 20 + ")"
      })

    lineLegend
      .append("text")
      .text(function (d) {
        return d
      })
      .attr("transform", "translate(15,9)") //align texts with boxes

    lineLegend
      .append("rect")
      .attr("fill", function (d, i) {
        return legend[d]
      })
      .attr("width", 10)
      .attr("height", 10)
  }, [])

  return (
    <div className="compare_chart chart_width">
      <svg
        style={{ position: "absolute", pointerEvents: "none", zIndex: 1 }}
        ref={svgRef}
      ></svg>
      <div style={{ overflowX: "scroll" }} ref={divRef}></div>
    </div>
  )
}

export default Chart
