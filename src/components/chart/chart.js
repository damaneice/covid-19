import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const Chart = ({ data, margin, name, stringToColor, updatedDate }) => {
  const svgWidth = 600,
    height = 220
  const divRef = useRef()
  const svgRef = useRef()

  useEffect(() => {
    //This is used to existing svg elements on resize
    const svgContainer = d3.select(divRef.current)
    svgContainer.selectAll("svg").remove()
    const svgElement = svgContainer
      .append("svg")
      .attr("width", svgWidth + margin.left)
      .attr("height", height + margin.bottom)
      .attr("style", "display: block")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data[0].values, function (d) {
          return d.date
        })
      )
      .range([0, svgWidth - margin.right])

    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 12)

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data
            .map(county => {
              return county.values
            })
            .flat(),
          function (d) {
            return +d.y
          }
        ),
      ])
      .range([height, 0])
    const svgAxisY = d3.select(svgRef.current)
    svgAxisY.selectAll("g").remove()
    svgAxisY
      .attr("height", height + margin.bottom)
      .attr("class", "chart_width")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.axisLeft(y).tickSizeOuter(0))

    const lineClassName = name
      .replace(/\s/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .toLowerCase()

    const mouseLineClass = "mouse-line" + lineClassName
    const mousePerLineClass = "mouse-per-line" + lineClassName
    data.forEach(county => {
      svgElement
        .append("path")
        .datum(county.values)
        .attr("class", lineClassName)
        .attr("fill", "none")
        .attr("stroke", stringToColor(county.name))
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.date)
            })
            .y(function (d) {
              return y(d.y)
            })
        )
    })
    const mouseG = svgElement.append("g").attr("class", "mouse-over-effects")

    mouseG
      .append("path") // this is the black vertical line to follow mouse
      .attr("class", mouseLineClass)
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0")

    const lines = document.getElementsByClassName(lineClassName)

    const mousePerLine = mouseG
      .selectAll("." + mousePerLineClass)
      .data(data)
      .enter()
      .append("g")
      .attr("class", mousePerLineClass)

    mousePerLine
      .append("circle")
      .attr("r", 7)
      .style("stroke", function (d) {
        return stringToColor(d.name)
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0")

    mousePerLine.append("text").attr("transform", "translate(10,3)")

    mouseG
      .append("svg:rect") // append a rect to catch mouse movements on canvas
      .attr("width", svgWidth) // can't catch mouse events on a g element
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", function () {
        // on mouse out hide line, circles and text
        d3.select("." + mouseLineClass).style("opacity", "0")
        d3.selectAll(`.${mousePerLineClass} circle`).style("opacity", "0")
        d3.selectAll(`.${mousePerLineClass}  text`).style("opacity", "0")
      })
      .on("mouseover", function () {
        // on mouse in show line, circles and text
        d3.select("." + mouseLineClass).style("opacity", "1")
        d3.selectAll(`.${mousePerLineClass} circle`).style("opacity", "1")
        d3.selectAll(`.${mousePerLineClass} text`).style("opacity", "1")
      })
      .on("mousemove", function () {
        // mouse moving over canvas
        var mouse = d3.mouse(this)
        d3.select("." + mouseLineClass).attr("d", function () {
          var d = "M" + mouse[0] + "," + height
          d += " " + mouse[0] + "," + 0
          return d
        })

        d3.selectAll("." + mousePerLineClass).attr("transform", function (
          d,
          i
        ) {
          let beginning = 0,
            end = lines[i].getTotalLength(),
            target = null
          let pos = null
          while (true) {
            target = Math.floor((beginning + end) / 2)
            pos = lines[i].getPointAtLength(target)
            if (
              (target === end || target === beginning) &&
              pos.x !== mouse[0]
            ) {
              break
            }
            if (pos.x > mouse[0]) end = target
            else if (pos.x < mouse[0]) beginning = target
            else break //position found
          }

          d3.select(this).select("text").text(y.invert(pos.y).toFixed(2))

          return "translate(" + mouse[0] + "," + pos.y + ")"
        })
      })
  }, [data, margin, name, stringToColor])

  return (
    <div>
      <div className="compare_chart chart_width">
        <div className="updated-date">{`Updated ${updatedDate}`}</div>
        <svg
          style={{ position: "absolute", pointerEvents: "none", zIndex: 1 }}
          ref={svgRef}
        ></svg>
        <div style={{ overflowX: "scroll" }} ref={divRef}></div>
      </div>
    </div>
  )
}

export default Chart
