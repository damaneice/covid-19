import * as d3 from "d3"
import React, { useEffect, useRef } from "react"

const Axis = () => {
  const ref = useRef()

  useEffect(() => {
    const xScale = d3.scaleLinear().domain([0, 100]).range([10, 290])

    const g = d3.select(ref.current)
    const axisGenerator = d3.axisBottom(xScale)
    g.call(axisGenerator)
  }, [])

  return <g ref={ref} />
}

export default Axis
