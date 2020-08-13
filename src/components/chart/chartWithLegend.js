import React, { useState } from "react"
import Chart from "./chart"
import Legend from "../legend"

const stringToColor = name => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = "#"
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff
    color += ("00" + value.toString(16)).substr(-2)
  }
  return color
}

const ChartWithLegend = ({ data, margin, name }) => {
  const [counties, setCounties] = useState(data)
  return (
    <div>
      <div className="chart_name">{name}</div>
      <div className="chart_width">
        <span style={{ marginRight: "4px" }}>Filter:</span>
        {data.map(county => {
          const color = stringToColor(county.name)
          return (
            <Legend
              toggleCounty={isActive => {
                if (isActive) {
                  const filteredCounties = counties.filter(
                    item => item.name !== county.name
                  )
                  if (filteredCounties.length > 0) {
                    setCounties(filteredCounties)
                  }
                  return filteredCounties.length > 0
                } else {
                  setCounties(counties.concat(county))
                  return true
                }
              }}
              key={color}
              name={county.name}
              fill={color}
            />
          )
        })}
      </div>
      <Chart
        data={counties}
        name={name}
        margin={margin}
        stringToColor={stringToColor}
      />
    </div>
  )
}

export default ChartWithLegend
