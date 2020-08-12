import React from "react"
import Legend from "../legend"
import Map from "./map"
import useMapContext from "./useMapContext"
import useWindow from "../useWindow"
import { getTotalCaseColor, totalCasesColors } from "../../util/totalCasesColor"

const TotalCasesMap = ({ counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)
  return (
    <>
      {mapContext && (
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
            selector="michigan-total-cases-map"
            features={mapContext.data.features}
            path={mapContext.path}
            counties={counties}
            getColor={getTotalCaseColor}
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

export default TotalCasesMap
