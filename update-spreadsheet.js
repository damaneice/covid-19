const fs = require("fs")
const moment = require("moment")
const neatCsv = require("neat-csv")
const ObjectsToCsv = require("objects-to-csv")

const updateData = async (newCases, newDeaths, metrics) => {
  const filename = "COVID-19-hospitalizations.csv"
  fs.readFile(`src/data/${filename}`, async (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    metrics["Deaths"] = newDeaths
    metrics["New Cases"] = newCases
    const list = await neatCsv(data)
    const index = list.findIndex(item => {
      return moment(item["Date"], "MM/DD/YYYY").isSame(
        moment(metrics["Date"], "MM/DD/YYYY")
      )
    })

    if (index == -1) {
      list.push(metrics)
    } else {
      list[index] = metrics
    }

    const csv = new ObjectsToCsv(list)
    await csv.toDisk(`src/data/${filename}`)
  })
}

module.exports = updateData
