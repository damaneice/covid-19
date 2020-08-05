import React from "react"
import Legend from "./legend"
import Map from "./map"

const rateOfChageColors = [
  { threadhold: 15, value: "rgb(235, 100, 2)" },
  { threadhold: 10, value: "rgb(235, 158, 2)" },
  { threadhold: 5, value: "rgb(235, 198, 2)" },
  { threadhold: 0, value: "rgb(235, 232, 2)" },
  { threadhold: -5, value: "rgb(201, 235, 2)" },
  { threadhold: -10, value: "rgb(143, 235, 2)" },
  { threadhold: -15, value: "rgb(120, 235, 2)" },
]

const getColor = county => {
  let color = rateOfChageColors[rateOfChageColors.length - 1].value
  for (let i = 0; i < rateOfChageColors.length; i++) {
    if (county.rateOfChange > rateOfChageColors[i].threadhold) {
      color = rateOfChageColors[i].value
      break
    }
  }
  return color
}
const CaseRateMap = ({ counties }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {rateOfChageColors
        .slice(0)
        .reverse()
        .map(rateOfChageColor => {
          return (
            <Legend
              key={rateOfChageColor.threadhold}
              name={rateOfChageColor.threadhold}
              fill={rateOfChageColor.value}
            />
          )
        })}
      <Map
        counties={counties}
        getColor={getColor}
        name="Michigan"
        margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
      />
    </div>
  )
}

export default CaseRateMap
