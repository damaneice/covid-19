import * as d3 from "d3"
import useWindowDimensions from "../hooks/useWindowDimensions"
import React, { useEffect, useRef } from "react"

const Chart = ({ data, margin }) => {
  const { width } = useWindowDimensions()
  const svgWidth = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom
  const ref = useRef()
  const svgRef = useRef()

  useEffect(() => {
    var svgElement = d3
      .select(ref.current)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${svgWidth + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data[0].values, function (d) {
          return d.date
        })
      )
      .range([0, svgWidth])

    svgElement
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 12)

    var y = d3
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
        ) + 100,
      ])
      .range([height, 0])
    var svgElement2 = d3.select(svgRef.current)
    svgElement2
      .attr("height", height)
      .attr("width", 30)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(d3.axisLeft(y).tickSizeOuter(0))

    svgElement
      .append("path")
      .datum(data[0].values)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
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

    svgElement
      .append("path")
      .datum(data[1].values)
      .attr("fill", "none")
      .attr("stroke", "green")
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
    const legend = {}
    legend[data[0].name] = "steelblue"
    legend[data[1].name] = "green"

    var lineLegend = svgElement
      .selectAll(".lineLegend")
      .data(Object.keys(legend))
      .enter()
      .append("g")
      .attr("class", "lineLegend")
      .attr("transform", function (d, i) {
        return "translate(" + margin.left + "," + i * 20 + ")"
      })

    lineLegend
      .append("text")
      .text(function (d) {
        return d
      })
      .attr("transform", "translate(15,9)") //align texts with boxes

    lineLegend
      .append("rect")
      .attr("fill", function (d, i) {
        return legend[d]
      })
      .attr("width", 10)
      .attr("height", 10)
  }, [])

  return (
    <div>
      <div className="compare">
        <div className="compare_chart">
          <svg ref={svgRef}></svg>
        </div>
        <div
          className="compare_chart"
          style={{
            minWidth: "260px",
            minHeight: "200px",
            overflowX: "auto",
          }}
          ref={ref}
        />
        {/* <div
          style={{
            minWidth: "260px",
            minHeight: "200px",
            overflowX: "auto",
          }}
          className="compare_chart"
        >
          <svg width={500} x="0px" y="0px" viewBox="0 65.326 612 502.174">
            <ellipse fill="#C6C6C6" cx="283.5" cy="487.5" rx="259" ry="80" />
            <path
              id="bird"
              d="M210.333,65.331C104.367,66.105-12.349,150.637,1.056,276.449c4.303,40.393,18.533,63.704,52.171,79.03  c36.307,16.544,57.022,54.556,50.406,112.954c-9.935,4.88-17.405,11.031-19.132,20.015c7.531-0.17,14.943-0.312,22.59,4.341  c20.333,12.375,31.296,27.363,42.979,51.72c1.714,3.572,8.192,2.849,8.312-3.078c0.17-8.467-1.856-17.454-5.226-26.933  c-2.955-8.313,3.059-7.985,6.917-6.106c6.399,3.115,16.334,9.43,30.39,13.098c5.392,1.407,5.995-3.877,5.224-6.991  c-1.864-7.522-11.009-10.862-24.519-19.229c-4.82-2.984-0.927-9.736,5.168-8.351l20.234,2.415c3.359,0.763,4.555-6.114,0.882-7.875  c-14.198-6.804-28.897-10.098-53.864-7.799c-11.617-29.265-29.811-61.617-15.674-81.681c12.639-17.938,31.216-20.74,39.147,43.489  c-5.002,3.107-11.215,5.031-11.332,13.024c7.201-2.845,11.207-1.399,14.791,0c17.912,6.998,35.462,21.826,52.982,37.309  c3.739,3.303,8.413-1.718,6.991-6.034c-2.138-6.494-8.053-10.659-14.791-20.016c-3.239-4.495,5.03-7.045,10.886-6.876  c13.849,0.396,22.886,8.268,35.177,11.218c4.483,1.076,9.741-1.964,6.917-6.917c-3.472-6.085-13.015-9.124-19.18-13.413  c-4.357-3.029-3.025-7.132,2.697-6.602c3.905,0.361,8.478,2.271,13.908,1.767c9.946-0.925,7.717-7.169-0.883-9.566  c-19.036-5.304-39.891-6.311-61.665-5.225c-43.837-8.358-31.554-84.887,0-90.363c29.571-5.132,62.966-13.339,99.928-32.156  c32.668-5.429,64.835-12.446,92.939-33.85c48.106-14.469,111.903,16.113,204.241,149.695c3.926,5.681,15.819,9.94,9.524-6.351  c-15.893-41.125-68.176-93.328-92.13-132.085c-24.581-39.774-14.34-61.243-39.957-91.247  c-21.326-24.978-47.502-25.803-77.339-17.365c-23.461,6.634-39.234-7.117-52.98-31.273C318.42,87.525,265.838,64.927,210.333,65.331  z M445.731,203.01c6.12,0,11.112,4.919,11.112,11.038c0,6.119-4.994,11.111-11.112,11.111s-11.038-4.994-11.038-11.111  C434.693,207.929,439.613,203.01,445.731,203.01z"
            />
          </svg>
        </div> */}
        <div className="compare_chart">TOTAL</div>
      </div>
    </div>
    // <div className="chart">
    //   <div className="compare_chart">
    //     <svg
    //       ref={svgRef}
    //     ></svg>
    //   </div>
    //   <div className="compare_chart"
    //     style={{
    //       overflowX: "auto",
    //       pointerEvents: "none",
    //       zIndex: 1,
    //     }}
    //     ref={ref}
    //   />
    //   <div className="compare_chart">
    //     <p>hello</p>
    //   </div>
    // </div>
  )
}

export default Chart
