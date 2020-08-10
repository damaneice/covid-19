import * as d3 from "d3"
import React, { useEffect, useState } from "react"
import Legend from "./legend"
import useMapContext from "./useMapContext"
import useWindow from "./useWindow"
import Map from "./map"

const randomUniform = (min, max) => Math.random() * (max - min) + min

const generatePoint = feature => {
  let point = []
  let bounds = d3.geoBounds(feature)
  while (point.length < 1) {
    let minX = bounds[0][0]
    let maxX = bounds[1][0]
    let minY = bounds[0][1]
    let maxY = bounds[1][1]
    let tempPoint = [randomUniform(minX, maxX), randomUniform(minY, maxY)]

    if (d3.geoContains(feature, tempPoint)) {
      point = tempPoint
    }
  }
  return point
}

const drawPoints = (features, projection) => {
  const points = []
  features.forEach(feature => {
    points.push(generatePoint(feature))
  })
  d3.select(".michigan-map")
    .selectAll("myCircles")
    .data(points)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return projection([d[0], d[1]])[0]
    })
    .attr("cy", function (d) {
      return projection([d[0], d[1]])[1]
    })
    .attr("r", 1)
    .style("fill", "69b3a2")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 0.1)
    .attr("fill-opacity", 0.35)
}

const CaseDotMap = ({ counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)

  return (
    <div style={{ textAlign: "center" }}>
      <Legend name="1 dot for 10 cases" fill="rgb(120, 235, 2)" />
      {mapContext && (
        <Map
          features={mapContext.data.features}
          path={mapContext.path}
          counties={counties}
          getColor={() => {
            return "#000099"
          }}
          name="Michigan"
          margin={margin}
          width={width}
          height={height}
          stroke="#F5F5F5"
        />
      )}

      <button
        onClick={() => {
          const features = mapContext.data.features
          const projection = mapContext.projection

          drawPoints(features, projection)
        }}
      >
        Generate
      </button>
    </div>
  )
}

export default CaseDotMap
