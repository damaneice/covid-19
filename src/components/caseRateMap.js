import React from "react"
import Legend from "./legend"
import { getCaseRateColor, rateOfChangeColors } from "../util/caseRateColor"
import Map from "./map"

const CaseRateMap = ({ counties }) => {
  return (
    <div style={{ textAlign: "center" }}>
      {rateOfChangeColors
        .slice(0)
        .reverse()
        .map(rateOfChangeColor => {
          return (
            <Legend
              key={rateOfChangeColor.threadhold}
              name={`${rateOfChangeColor.threadhold}%`}
              fill={rateOfChangeColor.value}
            />
          )
        })}
      <Map
        counties={counties}
        getColor={getCaseRateColor}
        name="Michigan"
        margin={{ top: 20, bottom: 80, right: 5, left: 40 }}
      />
    </div>
  )
}

export default CaseRateMap
