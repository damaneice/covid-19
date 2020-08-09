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
      const projection = d3
        .geoAlbers()
        .translate([width / 2, height / 2])
        .fitSize([width, height], data)
      const path = d3.geoPath().projection(projection)
      const svgContainer = d3.select(divRef.current)

      //This is used to existing svg elements on resize
      svgContainer.selectAll("svg").remove()

      const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left)
        .attr("height", height + margin.bottom)

      svg
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
      const uniform = (min, max) => Math.random() * (max - min) + min
      const generatePoint = feature => {
        let point = []
        let bounds = d3.geoBounds(feature)
        while (point.length < 1) {
          let minX = bounds[0][0]
          let maxX = bounds[1][0]
          let minY = bounds[0][1]
          let maxY = bounds[1][1]
          let tempPoint = [uniform(minX, maxX), uniform(minY, maxY)]

          if (d3.geoContains(feature, tempPoint)) {
            point = tempPoint
          }
        }
        return point
      }
      const points = []
      // setInterval(() => {
      //   console.log("something")
      //   data.features.forEach(feature => {
      //     points.push(generatePoint(feature))
      //   })

      //   svg
      //     .selectAll("myCircles")
      //     .data(points)
      //     .enter()
      //     .append("circle")
      //     .attr("cx", function (d) {
      //       return projection([d[0], d[1]])[0]
      //     })
      //     .attr("cy", function (d) {
      //       return projection([d[0], d[1]])[1]
      //     })
      //     .attr("r", 4)
      //     .style("fill", "69b3a2")
      //     .attr("stroke", "#69b3a2")
      //     .attr("stroke-width", 3)
      //     .attr("fill-opacity", 0.4)
      // }, 500)
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
