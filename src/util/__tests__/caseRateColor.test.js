import { getCaseRateColor } from "../caseRateColor"
import { getTotalCaseColor } from "../totalCasesColor"

describe("Case rate color", () => {
  it("returns rgb(120, 235, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: -16 })).toBe("rgb(120, 235, 2)")
  })
  it("returns rgb(143, 235, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: -14 })).toBe("rgb(143, 235, 2)")
  })
  it("returns rgb(201, 235, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: -9 })).toBe("rgb(201, 235, 2)")
  })
  it("returns rgb(235, 232, 2)  color", () => {
    expect(getCaseRateColor({ rateOfChange: -4 })).toBe("rgb(235, 232, 2)")
  })
  it("returns rgb(235, 232, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: 1 })).toBe("rgb(235, 232, 2)")
  })
  it("returns rgb(235, 198, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: 6 })).toBe("rgb(235, 198, 2)")
  })
  it("returnsrgb(235, 158, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: 11 })).toBe("rgb(235, 158, 2)")
  })
  it("returns rgb(235, 100, 2) color", () => {
    expect(getCaseRateColor({ rateOfChange: 16 })).toBe("rgb(235, 100, 2)")
  })
})

describe("Total cases color", () => {
  it("returns rgb(120, 235, 2) color", () => {
    expect(getTotalCaseColor({ cases: 10 })).toBe("#f7fbff")
  })
})
