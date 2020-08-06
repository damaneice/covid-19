import React from "react"
import Legend from "./legend"
import Map from "./map"

const totalCaseColors = [
  { threadhold: 15000, value: "#1059a1" },
  { threadhold: 7500, value: "#3585bf" },
  { threadhold: 1000, value: "#6badd5" },
  { threadhold: 150, value: "#a9cfe5" },
  { threadhold: 50, value: "#d6e5f4" },
  { threadhold: 0, value: "#f7fbff" },
]

const getColor = county => {
  let color = totalCaseColors[totalCaseColors.length - 1].value
  for (let i = 0; i < totalCaseColors.length; i++) {
    if (county.cases > totalCaseColors[i].threadhold) {
      color = totalCaseColors[i].value
      break
    }
  }
  return color
}
const TotalCasesMap = ({ counties }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {totalCaseColors
        .slice(0)
        .reverse()
        .map(totalCaseColor => {
          return (
            <Legend
              key={totalCaseColor.threadhold}
              name={totalCaseColor.threadhold}
              fill={totalCaseColor.value}
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

export default TotalCasesMap
