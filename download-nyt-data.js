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

const downloadNYTStateData = async link => {
  const usStatesFileNanme = "us-states.csv"
  await downloadFile(link, usStatesFileNanme)
  const data = await readFile(usStatesFileNanme)
  const list = await neatCsv(data)

  const michiganRows = list.filter(row => {
    return row.state.toLowerCase() === "michigan"
  })
  const states = {}
  // console.log(michiganRows)
  michiganRows.forEach(item => {
    if (states[item.state]) {
      const items = states[item.state]
      const previousItem = items[items.length - 1]
      item.newCases = parseInt(item.cases) - parseInt(previousItem.cases)
      item.newDeaths = parseInt(item.deaths) - parseInt(previousItem.deaths)
      states[item.state].push(item)
    } else {
      item.newCases = parseInt(item.cases)
      item.newDeaths = parseInt(item.deaths)
      states[item.state] = [item]
    }
  })
  const csv = new ObjectsToCsv(michiganRows)
  await csv.toDisk("src/data/state-cases-by-date.csv")
  await removeFile(usStatesFileNanme)
}

const downloadNYTCountyData = async link => {
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
      item.newDeaths = parseInt(item.deaths) - parseInt(previousItem.deaths)
      counties[item.county].push(item)
    } else {
      item.newCases = parseInt(item.cases)
      item.newDeaths = parseInt(item.deaths)
      counties[item.county] = [item]
    }
  })

  const csv = new ObjectsToCsv(michiganCounties)
  await csv.toDisk("src/data/cases-by-county-and-date.csv")
  await removeFile(usCountiesFileNanme)
}

const downloadNYTStatePer100kData = async link => {
  const usStatesFileNanme = "us-states-per-100k.csv"
  await downloadFile(link, usStatesFileNanme)
  const data = await readFile(usStatesFileNanme)
  const list = await neatCsv(data)

  const michiganRows = list.filter(row => {
    return row.state.toLowerCase() === "michigan"
  })
  const states = {}
  const csv = new ObjectsToCsv(michiganRows)
  await csv.toDisk("src/data/state-cases-by-date-per-100k.csv")
  await removeFile(usStatesFileNanme)
}

const downloadNYTCountyPer100kData = async link => {
  const usCountiesFileNanme = "us-counties.csv"
  await downloadFile(link, usCountiesFileNanme)
  const data = await readFile(usCountiesFileNanme)
  const list = await neatCsv(data)

  const michiganCounties = list.filter(row => {
    return row.state.toLowerCase() === "michigan"
  })

  const csv = new ObjectsToCsv(michiganCounties)
  await csv.toDisk("src/data/cases-by-county-and-date-per-100k.csv")
  await removeFile(usCountiesFileNanme)
}

const downloadNYTData = async () => {
  await downloadNYTCountyData(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"
  )
  await downloadNYTStateData(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
  )

  await downloadNYTStatePer100kData(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-states.csv"
  )

  await downloadNYTCountyPer100kData(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-counties.csv"
  )
}
module.exports = downloadNYTData
