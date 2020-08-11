import * as d3 from "d3"
import { sliderBottom } from "d3-simple-slider"
import React, { useEffect, useState } from "react"
import moment from "moment"
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
    .attr("class", `dots-${casesOnDate[0].date}`)
    .attr("r", 1)
    .style("fill", "rgb(235, 158, 2)")
    .attr("stroke-width", 0.1)
    .attr("fill-opacity", 0.35)
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

const Slider = ({ recordsByDate, mapContext, width }) => {
  useEffect(() => {
    const casesByDate = groupRecordsByDate(recordsByDate)
    const dates = Object.keys(casesByDate)
    d3.select("#timelapse-slider").select("svg").remove()
    const sliderValues = dates.map(date => moment(date, "MMM D").toDate())
    let previousDate = sliderValues[0]
    var slider = sliderBottom()
      .min(sliderValues[0])
      .max(d3.max(sliderValues))
      .width(width - 100)
      .displayValue(false)
      .on("onchange", val => {
        const sliderDate = moment(val).format("MMM D")
        if (casesByDate[sliderDate]) {
          if (moment(previousDate).isBefore(moment(val))) {
            const projection = mapContext.projection
            drawPoints(
              casesByDate[sliderDate],
              mapContext.countiesFeatures,
              projection
            )
          } else {
            d3.selectAll(`.dots-${moment(val).format("Y-MM-DD")}`).remove()
          }
        }
        previousDate = val
        d3.select("#value").text(sliderDate)
      })

    d3.select("#timelapse-slider")
      .append("svg")
      .attr("width", width)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)")
      .call(slider)

    let index = 0

    const timelapse = setInterval(() => {
      if (index < dates.length) {
        slider.value(moment(dates[index], "MMM D").toDate())
        index++
      } else {
        clearInterval(timelapse)
      }
    }, 300)
    console.log(timelapse)
    return () => {
      clearInterval(timelapse)
    }
  })

  return (
    <>
      <p id="value"></p>
      <div id="timelapse-slider"></div>
    </>
  )
}

const CaseDotMap = ({ recordsByDate, counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)

  return (
    <>
      {mapContext && (
        <div style={{ textAlign: "center" }}>
          <Legend name={"1 dot for 10 cases"} fill="rgb(235, 158, 2)" />
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

          <Slider
            width={width}
            recordsByDate={recordsByDate}
            mapContext={mapContext}
          />
        </div>
      )}
    </>
  )
}

export default CaseDotMap
