const axios = require("axios")
const cheerio = require('cheerio');
const fs = require("fs")
const baseURL = "https://www.michigan.gov"

const downloadPage = async (link) => {
    const response = await axios(link);
    return await response.data;
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

const downloadData = async (link) => {
    const page = await downloadPage(link)
    let $ = cheerio.load(page)
    const dataPageLink = $("a[href*='/coronavirus/']:contains('See Cumulative Data')").attr('href')
    const dataPage = await downloadPage(baseURL + dataPageLink);
    $ = cheerio.load(dataPage)
    const casesByCountyByDateLink = $("a[href*='/documents/coronavirus/Cases_by_County_and_Date']").attr('href')
    downloadXLSXFile(baseURL + casesByCountyByDateLink, "src/data/Cases_by_County_and_Date.xlsx")
    const diagnosticTestsByResultAndCountyLink = $("a[href*='/documents/coronavirus/Diagnostic_Tests_by_Result_and_County']").attr('href')
    downloadXLSXFile(baseURL + diagnosticTestsByResultAndCountyLink, "src/data/Diagnostic_Tests_by_Result_and_County.xlsx")
}
downloadData(`${baseURL}/coronavirus`)
