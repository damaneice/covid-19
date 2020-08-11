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

const drawPoints = (casesOnDate, countiesFeatures, projection) => {
  const pointsPerCase = 10
  const countyCaseTracking = {}
  const points = []
  //   cases: 1
  // county: "Charlevoix"
  // date: "2020-03-16"
  // deaths: 0
  // newCases: 0
  // newDeaths: 0
  casesOnDate.forEach(item => {
    if (countiesFeatures[item.county]) {
      const rollOverCases = countyCaseTracking[item.county]
        ? countyCaseTracking[item.county].rollOverCases
        : 0
      const casesToCreatePoints = rollOverCases + item.newCases
      const numberOfPointsToCreate = casesToCreatePoints / pointsPerCase
      countyCaseTracking[item.county] = {
        rollOverCases: casesToCreatePoints % pointsPerCase,
      }
      for (let i = 0; i < numberOfPointsToCreate; i++) {
        points.push(generatePoint(countiesFeatures[item.county]))
      }
    }
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
    .style("fill", "rgb(235, 158, 2)")
    .attr("stroke-width", 0.1)
    .attr("fill-opacity", 0.35)
}

const CaseDotMap = ({ casesByDate, counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)
  return (
    <div style={{ textAlign: "center" }}>
      <Legend name="1 dot for 10 cases" fill="rgb(235, 158, 2)" />
      {mapContext && (
        <Map
          features={mapContext.data.features}
          path={mapContext.path}
          counties={counties}
          getColor={() => {
            return "rgb(75, 33, 114)"
          }}
          name="Michigan"
          margin={margin}
          width={width}
          height={height}
          stroke="rgb(166, 86, 247)"
        />
      )}

      <button
        onClick={() => {
          const features = mapContext.data.features
          const projection = mapContext.projection
          const dates = Object.keys(casesByDate)
          let ticks = 0
          const interval = setInterval(() => {
            if (ticks >= dates.length) {
              clearInterval(interval)
            } else {
              drawPoints(
                casesByDate[dates[ticks]],
                mapContext.countiesFeatures,
                projection
              )
            }
            ticks++
          }, 200)
        }}
      >
        Generate
      </button>
    </div>
  )
}

export default CaseDotMap
