import * as d3 from "d3"
import { useEffect, useState } from "react"

const useMapContext = (width, height) => {
  const [mapContext, setMapContext] = useState()

  useEffect(() => {
    async function fetchJSON() {
      const data = await import("../../static/michigan-counties.json")
      const projection = d3.geoAlbers()
      projection
        .translate([width / 2, height / 2])
        .fitSize([width, height], data)

      const path = d3.geoPath().projection(projection)
      const countiesFeatures = {}
      data.features.forEach(feature => {
        countiesFeatures[feature.properties["NAME"]] = feature
      })
      setMapContext({
        countiesFeatures: countiesFeatures,
        data,
        path: path,
        projection: projection,
      })
    }
    fetchJSON()
  }, [width, height])

  return mapContext
}

export default useMapContext
