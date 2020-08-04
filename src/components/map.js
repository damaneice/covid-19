import * as d3 from "d3"
import useWindow from "../components/useWindow"
import React, { useEffect, useRef } from "react"
import Legend from "./legend"

const colors = [
  "rgb(235, 100, 52)",
  "rgb(235, 158, 52)",
  "rgb(235, 198, 52)",
  "rgb(235, 232, 52)",
  "rgb(201, 235, 52)",
  "rgb(143, 235, 52)",
  "rgb(120, 235, 52)",
]

const getColor = rateOfChage => {
  let color = colors[3]
  if (rateOfChage > 15) {
    color = colors[0]
  } else if (rateOfChage <= 15 && rateOfChage > 10) {
    color = colors[1]
  } else if (rateOfChage <= 10 && rateOfChage > 5) {
    color = colors[2]
  } else if (rateOfChage <= 5 && rateOfChage > 0) {
    color = colors[3]
  } else if (rateOfChage <= 5 && rateOfChage > 0) {
    color = colors[3]
  } else if (rateOfChage <= 0 && rateOfChage > -5) {
    color = colors[4]
  } else if (rateOfChage <= -5 && rateOfChage > -10) {
    color = colors[5]
  } else {
    color = colors[6]
  }
  return color
}
const Map = ({ counties, margin, name }) => {
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
          return getColor(counties[d.properties["NAME"]].rateOfChange)
        })
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
  }, [counties, margin, name, width, height])

  return (
    <div style={{ textAlign: "center" }}>
      <Legend name={"-15%"} fill={colors[6]} />
      <Legend name={"-10%"} fill={colors[5]} />
      <Legend name={"-5%"} fill={colors[4]} />
      <Legend name={"0%"} fill={colors[3]} />
      <Legend name={"5%"} fill={colors[2]} />
      <Legend name={"10%"} fill={colors[1]} />
      <Legend name={"15%"} fill={colors[0]} />
      <div ref={divRef}></div>
    </div>
  )
}

export default Map
