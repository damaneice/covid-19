export const totalCasesColors = [
  { threadhold: 15000, value: "#1059a1" },
  { threadhold: 7500, value: "#3585bf" },
  { threadhold: 1000, value: "#6badd5" },
  { threadhold: 150, value: "#a9cfe5" },
  { threadhold: 50, value: "#d6e5f4" },
  { threadhold: 0, value: "#f7fbff" },
]

export const getTotalCaseColor = county => {
  let color = totalCasesColors[totalCasesColors.length - 1].value
  for (let i = 0; i < totalCasesColors.length; i++) {
    if (county.cases > totalCasesColors[i].threadhold) {
      color = totalCasesColors[i].value
      break
    }
  }
  return color
}
