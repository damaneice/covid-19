import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const Map = ({
  counties,
  getColor,
  features,
  path,
  margin,
  height,
  width,
  selector,
  stroke = "#000",
}) => {
  const divRef = useRef()
  useEffect(() => {
    const svgContainer = d3.select(divRef.current)
    const svg = svgContainer
      .append("svg")
      .attr("class", selector)
      .attr("width", width + margin.left)
      .attr("height", height + margin.bottom)

    svg
      .append("g")
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("fill", function (d) {
        return getColor(counties[d.properties["NAME"]])
      })
      .attr("stroke", stroke)
      .attr("stroke-width", 0.25)
      .attr("stroke-dasharray", 1)
      .attr("d", path)
      .on("mouseenter", function (d) {
        d3.select(this).style("stroke-width", 1.5).style("stroke-dasharray", 0)
      })
      .on("mouseleave", function (d) {
        d3.select(this).style("stroke-width", 0.25).style("stroke-dasharray", 1)
      })
    return () => {
      svg.remove()
    }
  })

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={divRef}></div>
      <div>map</div>
    </div>
  )
}

export default Map
