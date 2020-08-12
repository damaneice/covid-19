import React from "react"
import Legend from "./legend"
import { getCaseRateColor, rateOfChangeColors } from "../util/caseRateColor"
import useMapContext from "./useMapContext"
import useWindow from "./useWindow"
import Map from "./map"

const CaseRateMap = ({ counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)
  return (
    <>
      {mapContext && (
        <div style={{ textAlign: "center" }}>
          {rateOfChangeColors
            .slice(0)
            .reverse()
            .map((rateOfChangeColor, index) => {
              const name =
                index === rateOfChangeColors.length - 1
                  ? ` >${rateOfChangeColor.threadhold}%`
                  : `${rateOfChangeColor.threadhold}%`
              return (
                <Legend
                  key={rateOfChangeColor.threadhold}
                  name={name}
                  fill={rateOfChangeColor.value}
                />
              )
            })}
          <Map
            selector="michigan-case-rate-map"
            features={mapContext.data.features}
            path={mapContext.path}
            counties={counties}
            getColor={getCaseRateColor}
            name="Michigan"
            margin={margin}
            width={width}
            height={height}
          />
        </div>
      )}
    </>
  )
}

export default CaseRateMap
