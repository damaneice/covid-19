import * as d3 from "d3"
jest.mock("d3")
import { generateDot } from "../../map/caseDotMap"

describe("Dot map", () => {
  beforeEach(() => {
    d3.geoBounds = jest.fn(() => {
      return [
        [-83.689384, 42.431179],
        [-83.083393, 42.888647],
      ]
    })
  })

  describe("does not generate dot", () => {
    it("fails after 10 tries", () => {
      const features = oaklandCountyFeatures()
      d3.geoContains = jest.fn(() => {
        return false
      })

      expect(generateDot(features).length).toEqual(0)
    })
  })

  describe("does generate dot", () => {
    it("inside feature bounds", () => {
      const features = oaklandCountyFeatures()
      d3.geoContains = jest.fn(() => {
        return true
      })
      expect(generateDot(features).length).toEqual(2)
    })
  })
})

const oaklandCountyFeatures = () => {
  return {
    type: "Feature",
    properties: {
      GEO_ID: "0500000US26125",
      STATE: "26",
      COUNTY: "125",
      NAME: "Oakland",
      LSAD: "County",
      CENSUSAREA: 867.663,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-83.098, 42.770547],
          [-83.097629, 42.763296],
          [-83.09756, 42.761833],
          [-83.096031, 42.741411],
          [-83.09603, 42.741388],
          [-83.095339, 42.71249],
          [-83.095436, 42.712491],
          [-83.095255, 42.708826],
          [-83.095062, 42.7044],
          [-83.094793, 42.696985],
          [-83.094664, 42.693424],
          [-83.094655, 42.693048],
        ],
      ],
    },
  }
}
