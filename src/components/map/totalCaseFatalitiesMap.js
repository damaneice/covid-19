import React from "react"
import Legend from "../legend"
import Map from "./map"
import useMapContext from "./useMapContext"
import useWindow from "../useWindow"
import {
  getTotalCaseFatalitiesColor,
  totalCaseFatalitiesColors,
} from "../../util/totalCaseFatalitiesColors"

const TotalCaseFatalitiesMap = ({ counties, margin }) => {
  const size = useWindow()
  const width = size.width + margin.left > 600 ? 600 : 300
  const height = size.width + margin.left > 600 ? 400 : 200
  const mapContext = useMapContext(width, height)
  return (
    <>
      {mapContext && (
        <div style={{ textAlign: "center" }}>
          {totalCaseFatalitiesColors
            .slice(0)
            .reverse()
            .map(color => {
              return (
                <Legend
                  key={color.threadhold}
                  name={color.threadhold}
                  fill={color.value}
                />
              )
            })}
          <Map
            selector="michigan-total-case-fatalities-map"
            features={mapContext.data.features}
            path={mapContext.path}
            counties={counties}
            getColor={getTotalCaseFatalitiesColor}
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

export default TotalCaseFatalitiesMap
