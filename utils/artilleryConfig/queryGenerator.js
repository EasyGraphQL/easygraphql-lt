'use strict'

const fs = require('fs')
const path = require('path')
const EasyGraphQLLoadTester = require('easygraphql-load-tester')

const { config: { selectedQueries, queryFile, queryFilePath, withMutations }, args } = require('./config.json')

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')

const easyGraphQLLoadTester = new EasyGraphQLLoadTester(schema, args)

const options = {
  selectedQueries,
  queryFile,
  queryFilePath,
  withMutations
}

const testCases = easyGraphQLLoadTester.artillery(options)

module.exports = {
  testCases
}
