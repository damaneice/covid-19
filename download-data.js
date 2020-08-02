const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")
const XLSX = require("xlsx")
const baseURL = "https://www.michigan.gov"
const updateData = require("./update-spreadsheet")

const downloadPage = async link => {
  const response = await axios(link)
  return await response.data
}

const downloadXLSXFile = (url, dataPath) =>
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

const writeFile = (path, data, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, err => {
      if (err) reject(err)
      else resolve()
    })
  })

const downloadAboutPlacesData = async dataAboutPlacesLink => {
  const dataAboutPlacesPage = await downloadPage(baseURL + dataAboutPlacesLink)
  $ = cheerio.load(dataAboutPlacesPage)
  const covid19MetricsTable = $("table:contains('COVID-19 Metrics')")
  const date = covid19MetricsTable
    .find("strong:contains('COVID-19 Metrics')")
    .text()
    .replace("COVID-19 Metrics", "")
    .trim()

  const metricsTitles = [
    "ED Discharges",
    "Critical Care",
    "Ventilators",
    "Inpatients",
  ]
  const metrics = { Date: date }
  covid19MetricsTable
    .find("tr")
    .slice(1)
    .each((i, row) => {
      metrics[metricsTitles[i]] = $(row).children().last().text()
    })

  return metrics
}

const downloadData = async link => {
  const page = await downloadPage(link)
  let $ = cheerio.load(page)
  const cumulativeDataPageLink = $(
    "a[href*='/coronavirus/']:contains('See Cumulative Data')"
  ).attr("href")
  const stats = $(".stat-container").find(".stats-text")
  const newCases = $(stats[2]).text().replace(/,/g, "").replace(/\*/g, "")
  const newDeaths = $(stats[3]).text().replace(/,/g, "").replace(/\*/g, "")
  const cumulativeDataPage = await downloadPage(
    baseURL + cumulativeDataPageLink
  )
  $ = cheerio.load(cumulativeDataPage)
  const casesByCountyByDateLink = $(
    "a[href*='/documents/coronavirus/Cases_by_County_and_Date']"
  ).attr("href")
  await downloadXLSXFile(
    baseURL + casesByCountyByDateLink,
    "src/data/Cases_by_County_and_Date.xlsx"
  )
  const workBook = XLSX.readFile("src/data/Cases_by_County_and_Date.xlsx")
  const workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const csv = XLSX.utils.sheet_to_csv(workSheet)

  await writeFile("src/data/Cases_by_County_and_Date.csv", csv)
  const diagnosticTestsByResultAndCountyLink = $(
    "a[href*='/documents/coronavirus/Diagnostic_Tests_by_Result_and_County']"
  ).attr("href")
  downloadXLSXFile(
    baseURL + diagnosticTestsByResultAndCountyLink,
    "src/data/Diagnostic_Tests_by_Result_and_County.xlsx"
  )
  const dataAboutPlacesLink = $(
    "a[href*='/coronavirus/']:contains('Data About Places')"
  ).attr("href")
  const metrics = await downloadAboutPlacesData(dataAboutPlacesLink)
  updateData(newCases, newDeaths, metrics)
}
downloadData(`${baseURL}/coronavirus`)
