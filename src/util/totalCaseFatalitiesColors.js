export const totalCaseFatalitiesColors = [
  { threadhold: 2000, value: "#7532b3" },
  { threadhold: 1000, value: "#8e4ccd" },
  { threadhold: 250, value: "#a774d8" },
  { threadhold: 100, value: "#c09ce3" },
  { threadhold: 10, value: "#d9c3ee" },
  { threadhold: 0, value: "#f2ebf9" },
]

export const getTotalCaseFatalitiesColor = county => {
  let color =
    totalCaseFatalitiesColors[totalCaseFatalitiesColors.length - 1].value
  for (let i = 0; i < totalCaseFatalitiesColors.length; i++) {
    if (county.deaths > totalCaseFatalitiesColors[i].threadhold) {
      color = totalCaseFatalitiesColors[i].value
      break
    }
  }
  return color
}
