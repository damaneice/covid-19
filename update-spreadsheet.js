const fs = require("fs")
const moment = require("moment")
const neatCsv = require("neat-csv")
const ObjectsToCsv = require("objects-to-csv")

const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, async (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

const updateData = async metrics => {
  const hospitalizationsFileName = "COVID-19-hospitalizations.csv"
  const casesByDateData = await readFile("src/data/state-cases-by-date.csv")
  const casesByDate = await neatCsv(casesByDateData)

  const caseByDate = casesByDate.find(item => {
    return moment(item["date"], "YYYY-MM-DD").isSame(
      moment(metrics["Date"], "MM/DD/YYYY")
    )
  })
  if (caseByDate) {
    metrics["Deaths"] = caseByDate.newDeaths
    metrics["New Cases"] = caseByDate.newCases
    const hospitalizationsData = await readFile(
      `src/data/${hospitalizationsFileName}`
    )

    const hospitalizations = await neatCsv(hospitalizationsData)
    const index = hospitalizations.findIndex(item => {
      return moment(item["Date"], "MM/DD/YYYY").isSame(
        moment(metrics["Date"], "MM/DD/YYYY")
      )
    })
    if (index == -1) {
      hospitalizations.push(metrics)
    } else {
      hospitalizations[index] = metrics
    }

    const csv = new ObjectsToCsv(hospitalizations)
    await csv.toDisk(`src/data/${hospitalizationsFileName}`)
  }
}

module.exports = updateData
