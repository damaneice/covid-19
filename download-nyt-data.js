const axios = require("axios")
const fs = require("fs")
const neatCsv = require("neat-csv")
const ObjectsToCsv = require("objects-to-csv")

const downloadFile = (url, dataPath) =>
  axios({
    url,
    responseType: "stream",
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(dataPath))
          .on("finish", () => resolve())
          .on("error", e => reject(e))
      })
  )

const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, async (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

const removeFile = path => {
  new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        console.log(`${err}`)
        reject(err)
      } else {
        console.log(`${path} removed`)
        resolve()
      }
    })
  })
}

const downloadNYTData = async link => {
  const usCountiesFileNanme = "us-counties.csv"
  await downloadFile(link, usCountiesFileNanme)
  const data = await readFile(usCountiesFileNanme)
  const list = await neatCsv(data)

  const michiganCounties = list.filter(row => {
    return row.state.toLowerCase() === "michigan"
  })

  const counties = {}
  michiganCounties.forEach(item => {
    if (counties[item.county]) {
      const items = counties[item.county]
      const previousItem = items[items.length - 1]
      item.newCases = parseInt(item.cases) - parseInt(previousItem.cases)
      counties[item.county].push(item)
    } else {
      item.newCases = parseInt(item.cases)
      counties[item.county] = [item]
    }
  })

  const csv = new ObjectsToCsv(michiganCounties)
  await csv.toDisk("src/data/cases-by-county-and-date.csv")
  await removeFile(usCountiesFileNanme)
}
module.exports = downloadNYTData
