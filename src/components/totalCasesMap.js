import React from "react"
import Legend from "./legend"
import Map from "./map"
import { getTotalCaseColor, totalCasesColors } from "../util/totalCasesColor"

const TotalCasesMap = ({ counties }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {totalCasesColors
        .slice(0)
        .reverse()
        .map(totalCasesColor => {
          return (
            <Legend
              key={totalCasesColor.threadhold}
              name={totalCasesColor.threadhold}
              fill={totalCasesColor.value}
            />
          )
        })}
      <Map
        counties={counties}
        getColor={getTotalCaseColor}
        name="Michigan"
        margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
      />
    </div>
  )
}

export default TotalCasesMap
