export const countyCaseDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDateCsvSheet1
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].cases = parseInt(edge.node.cases)
      counties[edge.node.county].newCases = edge.node.newCases
      counties[edge.node.county].chart.push({
        newCases: edge.node.newCases,
        newDeaths: edge.node.newDeaths,
        date: edge.node.date,
        totalCases: parseInt(edge.node.cases),
      })
    } else {
      counties[edge.node.county] = { newCases: 0, cases: 0, chart: [] }
    }
  })

  return counties
}

export const countyCasePer100KDataTransformer = data => {
  const { edges } = data.allCasesByCountyAndDatePer100KCsvSheet1
  const counties = {}
  edges.forEach(edge => {
    if (counties[edge.node.county]) {
      counties[edge.node.county].chart.push({
        casesAvgPer100K: edge.node['cases_avg_per_100k'],
        deathsAvgPer100K: edge.node['deaths_avg_per_100k'],
        date: edge.node.date,
      })
    } else {
      counties[edge.node.county] = { chart: [] }
    }
  })

  return counties
}

export const stateCaseDataTransformer = data => {
  const { edges } = data.allStateCasesByDateCsvSheet1
  const state = {}
  edges.forEach(edge => {
    if (state[edge.node.state]) {
      state[edge.node.state].cases = parseInt(edge.node.cases)
      state[edge.node.state].newCases = edge.node.newCases
      state[edge.node.state].chart.push({
        newCases: edge.node.newCases,
        newDeaths: edge.node.newDeaths,
        date: edge.node.date,
        totalCases: parseInt(edge.node.cases),
      })
    } else {
      state[edge.node.state] = { newCases: 0, cases: 0, chart: [] }
    }
  })

  return state
}

export const stateCasePer100KDataTransformer = data => {
  const { edges } = data.allStateCasesByDatePer100KCsvSheet1
  const state = {}
  edges.forEach(edge => {
    if (state[edge.node.state]) {
      state[edge.node.state].chart.push({
        casesAvgPer100K: edge.node['cases_avg_per_100k'],
        deathsAvgPer100K: edge.node['deaths_avg_per_100k'],
        date: edge.node.date,
      })
    } else {
      state[edge.node.state] = { chart: [] }
    }
  })

  return state
}
