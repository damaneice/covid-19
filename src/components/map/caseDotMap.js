import * as d3 from "d3"
import { sliderBottom } from "d3-simple-slider"
import React, { useEffect } from "react"
import moment from "moment"
import Legend from "../legend"
import useMapContext from "./useMapContext"
import useWindow from "../useWindow"
import Map from "./map"

export const randomUniform = (min, max) => Math.random() * (max - min) + min

export const generateDot = feature => {
  let dot = []
  let bounds = d3.geoBounds(feature)
  let count = 0
  while (dot.length < 1 && count < 10) {
    let minX = bounds[0][0]
    let maxX = bounds[1][0]
    let minY = bounds[0][1]
    let maxY = bounds[1][1]
    let tempDot = [randomUniform(minX, maxX), randomUniform(minY, maxY)]
    if (d3.geoContains(feature, tempDot)) {
      dot = tempDot
    }
    count++
  }
  return dot
}

const drawPoints = (
  casesOnDate,
  countiesFeatures,
  countyCaseTracking,
  projection
) => {
  const pointsPerCase = 10
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
        points.push(generateDot(countiesFeatures[item.county]))
      }
    }
  })

  const svg = d3.select(".michigan-dot-map")
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
    var slider = sliderBottom()
      .min(sliderValues[0])
      .max(d3.max(sliderValues))
      .width(width - 100)
      .displayValue(false)
      .on("start", val => {
        sliderStart()
      })
      .on("onchange", val => {
        sliderOnChange(val)
      })

    d3.select("#timelapse-slider")
      .append("svg")
      .attr("width", width)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(50,30)")
      .call(slider)

    let index = 0
    const timelapse = setInterval(() => {
      if (index < dates.length) {
        slider.value(moment(dates[index], "MMM D").toDate())
        index++
      } else {
        clearInterval(timelapse)
      }
    }, 400)
    const sliderStart = () => {
      clearInterval(timelapse)
    }

    const projection = mapContext.projection
    const features = mapContext.countiesFeatures
    const countyCaseTracking = {}
    drawPoints(casesByDate[dates[0]], features, countyCaseTracking, projection)
    let previousDate = dates[0]
    const sliderOnChange = val => {
      const sliderDate = moment(val).format("MMM D")
      if (casesByDate[sliderDate]) {
        if (moment(previousDate, "MMM D").isBefore(moment(val))) {
          drawPoints(
            casesByDate[sliderDate],
            features,
            countyCaseTracking,
            projection
          )
          previousDate = sliderDate
        } else {
          const index = dates.indexOf(sliderDate)
          const dotSelectors = dates
            .slice(index)
            .map(date => `.dots-${moment(date, "MMM D").format("Y-MM-DD")}`)
            .join(",")
          d3.selectAll(dotSelectors).remove()
          previousDate = dates[dates.indexOf(sliderDate)]
        }
      }
      d3.select("#value").text(sliderDate)
    }

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
            selector="michigan-dot-map"
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
