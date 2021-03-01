const fs = require('fs')
const packageJson = require('./package.json')

const appVersion = packageJson.version

const jsonData = {
  version: appVersion
}

const jsonContent = JSON.stringify(jsonData)

fs.writeFile('./public/version.json', jsonContent, 'utf8', (err) => {
  if (err) {
    // console.log('An error occured while writing JSON Object to version.json')
    return err
  }

  // return console.log(
  return `version.json file has been saved with version ${appVersion}`
  // )
})
