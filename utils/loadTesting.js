'use strict'

const fs = require('fs-extra')
const path = require('path')
const { spawn, exec } = require('child_process')
const moment = require('moment')
const ora = require('ora')

const startLoadTesting = (configFile, localSchema) => {
  const { config: { url, name } } = require(configFile)

  const schemaPath = artilleryConfigPath('schema.gql')

  const testName = name ? name : url
  const spinner = ora(`Preparing load testing for: ${testName}`).start()

  if (localSchema) {
    fs.copyFile(localSchema, schemaPath, err => {
      startLoadTestingCallBack(err, configFile, spinner)
    })
  } else {
    // Download a copy of the schema to be tested.
    exec(`npx get-graphql-schema ${url} > ${schemaPath}`, (err) => {
      startLoadTestingCallBack(err, configFile, spinner)
    })
  }
}

const startLoadTestingCallBack = (err, configFile, spinner) => {
  if (err) {
    console.log('Error:', err.message)
  }

  runLoadTesting(configFile, spinner)
}

const runLoadTesting = (configFile, spinner) => {
  configFile = require(configFile)
  const newConfigFile = artilleryConfigPath('config.json')

  // if queryFile is required, add the path of the running folder
  if (configFile.config.queryFile) {
    configFile.config['queryFilePath'] = path.resolve()
  }

  fs.writeJSON(newConfigFile, configFile, (err) => {
    if (err) {
      console.log('Error:', err)
      deleteArgsFile('schema.gql')
    }

    spinner.stop()
    const { config: { url, duration = 5, arrivalRate = 10, withOutput, queryFilePath, headers } } = require(newConfigFile)
    let reportPath

    const artilleryBin = path.join(__dirname, '..', 'node_modules/.bin/artillery')
    let options = [
      'run',
      '--target',
      `${url}`,
      'artillery.yml'
    ]

    const configOverride = {
      config: {
        phases: [{duration, arrivalRate }]
      }
    }
    
    if (headers) {
      configOverride['config']['defaults'] = {
        headers
      }    
    }

    options = options.concat(['--overrides', `'${JSON.stringify(configOverride)}'`])

    if (withOutput) {
      const date = moment().format('YYYYMMDDHHMMSS').toString()
      reportPath = path.join(path.resolve(), `${date}.json`)
      options = options.concat(['--output', reportPath])
    }

    const artilleryRun = spawn(artilleryBin, options, {
      shell: true,
      cwd: artilleryConfigPath()
    })

    artilleryRun.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    artilleryRun.stderr.on('data', (data) => {
      console.log('Error:', data.toString())
    })

    artilleryRun.on('exit', code => {
      if (code === 0) {
        if (withOutput && reportPath) {
          console.log(`Full report run: "npx artillery report ${reportPath}"`, '\n')
        }
        if (queryFilePath) {
          console.log(`Query file: ${queryFilePath}/easygraphql-load-tester-queries.json`, '\n')
        }
        console.log('Thanks for using easygraphql-lt 🔥')
      }
     
      deleteArgsFile('config.json')
      deleteArgsFile('schema.gql')
    })
  })
}

const deleteArgsFile = fileName => {
  const filePath = artilleryConfigPath(fileName)
  fs.remove(filePath, err => {
    if (err) {
      console.log('Error: ', err)
    };
  })
}

const artilleryConfigPath = (fileName = '') => path.join(__dirname, '.', 'artilleryConfig', fileName)

module.exports = { startLoadTesting, runLoadTesting }
