import * as d3 from "d3"
import React, { useEffect, useState } from "react"
import moment from "moment"
import Legend from "./legend"
import useMapContext from "./useMapContext"
import useWindow from "./useWindow"
import Map from "./map"
import "rc-slider/assets/index.css"

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
  casesOnDate.forEach(item => {
    if (countiesFeatures[item.county]) {
      const rollOverCases = countyCaseTracking[item.county]
        ? countyCaseTracking[item.county].rollOverCases
        : 0
      const casesToCreatePoints = rollOverCases + item.newCases
      const numberOfPointsToCreate = parseInt(
        casesToCreatePoints / pointsPerCase
      )
      countyCaseTracking[item.county] = {
        rollOverCases: casesToCreatePoints % pointsPerCase,
      }

      for (let i = 0; i < numberOfPointsToCreate; i++) {
        points.push(generatePoint(countiesFeatures[item.county]))
      }
    }
  })

  const svg = d3.select(".michigan-map")
  svg.selectAll("text").remove()
  svg
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

  svg.selectAll("text").attr("transform", "translate(-5,0)")

  svg
    .append("text")
    .text(casesOnDate[0].date)
    .attr("y", 300)
    .attr("dx", 250)
    .style("text-anchor", "end")
}

const groupRecordsByDate = records => {
  const groupedRecords = {}

  records.forEach(record => {
    const startOfWeek = moment(record.node.date).startOf("week").format("MMM D")
    if (groupedRecords[startOfWeek]) {
      groupedRecords[startOfWeek].push(record.node)
    } else {
      groupedRecords[startOfWeek] = [record.node]
    }
  })
  return groupedRecords
}
// const marks = {
//   0: <strong>0°C</strong>,
//   26: "26°C",
//   37: "37°C",
//   50: "50°C",
//   100: {
//     style: {
//       color: "red",
//     },
//     label: <strong>100°C</strong>,
//   },
// }

const CaseDotMap = ({ recordsByDate, counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)
  const casesByDate = groupRecordsByDate(recordsByDate)
  const dates = Object.keys(casesByDate)
  const marks = {}
  dates.forEach((date, index) => {
    if (index % 5 === 0) {
      marks[index] = date
    }
  })
  let sliderIndex = 0

  return (
    <div style={{ textAlign: "center" }}>
      <Legend name={"1 dot for 10 cases"} fill="rgb(235, 158, 2)" />
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
      <form>
        <input
          type="range"
          defaultValue="0"
          min="0"
          max="21"
          onChange={event => {
            const projection = mapContext.projection
            drawPoints(
              casesByDate[dates[sliderIndex]],
              mapContext.countiesFeatures,
              projection
            )
            sliderIndex = event.target.value
          }}
          style={{ width: "300px" }}
        />
      </form>
      <button
        onClick={() => {
          const projection = mapContext.projection
          drawPoints(
            casesByDate[dates[sliderIndex]],
            mapContext.countiesFeatures,
            projection
          )

          sliderIndex = sliderIndex + 1
        }}
        // }, 200)
      >
        Generate
      </button>
      <button
        onClick={() => {
          d3.selectAll(".dot-2020-03-10").remove()
        }}
      >
        undo
      </button>{" "}
    </div>
  )
}

export default CaseDotMap
