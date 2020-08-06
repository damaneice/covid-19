import * as d3 from "d3"
import useWindow from "../components/useWindow"
import React, { useEffect, useRef } from "react"

const Map = ({ counties, getColor, margin, name }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200

  const divRef = useRef()
  useEffect(() => {
    async function fetchJSON() {
      const data = await import("../../static/michigan-counties.json")
      const path = d3.geoPath().projection(
        d3
          .geoAlbers()
          .translate([width / 2, height / 2])
          .fitSize([width, height], data)
      )
      const svgContainer = d3.select(divRef.current)

      //This is used to existing svg elements on resize
      svgContainer.selectAll("svg").remove()

      svgContainer
        .append("svg")
        .attr("width", width + margin.left)
        .attr("height", height + margin.bottom)
        .append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
          return getColor(counties[d.properties["NAME"]])
        })
        .attr("stroke", "#000")
        .attr("stroke-width", 0.25)
        .attr("stroke-dasharray", 1)
        .attr("d", path)
        .on("mouseenter", function (d) {
          d3.select(this)
            .style("stroke-width", 1.5)
            .style("stroke-dasharray", 0)
        })
        .on("mouseleave", function (d) {
          d3.select(this)
            .style("stroke-width", 0.25)
            .style("stroke-dasharray", 1)
        })
    }
    fetchJSON()
  }, [counties, getColor, margin, name, width, height])

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={divRef}></div>
    </div>
  )
}

export default Map
