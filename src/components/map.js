import * as d3 from "d3"
import React, { useRef } from "react"

const Map = ({
  counties,
  getColor,
  features,
  path,
  margin,
  height,
  width,
  stroke = "#000",
}) => {
  const divRef = useRef()

  const svgContainer = d3.select(divRef.current)

  //This is used to existing svg elements on resize
  svgContainer.selectAll("svg").remove()

  const svg = svgContainer
    .append("svg")
    .attr("class", "michigan-map")
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

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={divRef}></div>
    </div>
  )
}

export default Map
