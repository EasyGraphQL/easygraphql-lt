'use strict'

const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

const { startLoadTesting } = require('../utils/loadTesting')

function runArtillery () {
  let fileName
  let filePath
  const questions = []

  const arg = argv._.length > 0 ? argv._[0] : false

  if (arg && arg.includes('.json') && fs.existsSync(arg)) {
    fileName = arg
  } else if (arg && fs.existsSync(arg)) {
    let files = fs.readdirSync(arg)
    files = files.filter(file => file.includes('.json'))
    const options = {
      type: 'list',
      name: 'configFile',
      message: 'Config file:',
      choices: files
    }
    questions.push(options)
    filePath = arg
  } else {
    let files = fs.readdirSync(path.resolve())
    files = files.filter(file => file.includes('.json'))
    if (files.length === 0) {
      console.log('> Error: There are no JSON files in this dir! ❌')
      process.exit(1)
    }
    const options = {
      type: 'list',
      name: 'configFile',
      message: 'Config file:',
      choices: files
    }
    questions.push(options)
  }

  inquirer.prompt(questions).then(answers => {
    fileName = fileName || answers['configFile']
    const configFile = filePath ? path.join(path.resolve(), filePath, fileName) : path.join(path.resolve(), fileName)

    startLoadTesting(configFile)
  })
}

module.exports = runArtillery
