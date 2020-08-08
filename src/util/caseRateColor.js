export const rateOfChangeColors = [
  { threadhold: 15, value: "rgb(235, 100, 2)" },
  { threadhold: 10, value: "rgb(235, 158, 2)" },
  { threadhold: 5, value: "rgb(235, 198, 2)" },
  { threadhold: 0, value: "rgb(235, 232, 2)" },
  { threadhold: -5, value: "rgb(201, 235, 2)" },
  { threadhold: -10, value: "rgb(143, 235, 2)" },
  { threadhold: -15, value: "rgb(120, 235, 2)" },
]

export const getCaseRateColor = county => {
  let color = rateOfChangeColors[6].value
  const rateOfChange = county.rateOfChange
  if (rateOfChange > 15) {
    color = rateOfChangeColors[0].value
  } else if (15 >= rateOfChange && rateOfChange > 10) {
    color = rateOfChangeColors[1].value
  } else if (10 >= rateOfChange && rateOfChange > 5) {
    color = rateOfChangeColors[2].value
  } else if (5 >= rateOfChange && rateOfChange > 0) {
    color = rateOfChangeColors[3].value
  } else if (0 >= rateOfChange && rateOfChange > -5) {
    color = rateOfChangeColors[4].value
  } else if (-5 >= rateOfChange && rateOfChange > -10) {
    color = rateOfChangeColors[5].value
  } else if (-10 >= rateOfChange && rateOfChange > -15) {
    color = rateOfChangeColors[6].value
  }

  return color
}
