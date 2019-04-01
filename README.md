<h1 align="center">
  <img src="https://raw.githubusercontent.com/EasyGraphQL/easygraphql-now/master/logo.png" alt="easygraphql-lt " width="350">
  <br>
    easygraphql-lt
  <br>
  <br>
</h1>

easygraphql-load-tester is the new version of [easygraphql-load-tester](https://github.com/EasyGraphQL/easygraphql-load-tester); 
now the configuration is minimum, it only requires a `JSON` file. 

It uses [Artillery.io](https://artillery.io/) under the hood.

## How to run it:

```shell
$ npx easygraphql-lt <CONFIG_FILE>.json
```

## How to use it:

Create a JSON file that should have the next values:

#### config:
##### URL (Required)
The URL that is going to be used to do the load testing, it'll be used to get the latest copy
of the GraphQL schema and to make all queries/mutations.

```JSON
"url": "http://localhost:7000/"
```

##### Name (Optional):
This will be the name that the test is going to have; this is optional if it's not set
it will display the URL as the name.

```JSON
"name": "Testing my new server"
```

##### Selected queries (Optional)
You can select a list of the queries/mutations you want to test, to do this, you must create an
array of strings with the name of the queries to test; this is optional if you don't
create it, all the queries are going to be tested.

```JSON
"selectedQueries": ["createUser", "searchUser"]
```

#### Query file (Optional)
You can select if you want to save a `json` file with all the queries that were tested.
If you don't pass anything it is not going to be saved. The default value is `false`.

```JSON
"queryFile": true/false
```

#### Mutations (Optional)
You can use [`easygraphql-lt`](https://github.com/EasyGraphQL/easygraphql-lt) to test
your mutations as well; if you don't pass anything it is only going to test the queries. 
The default value is `false`.
*If you set `withMutations: true`, don't forget to add the input values on the args*

```JSON
"withMutations": true/false
```

#### Duration (Optional)
You can select the duration for your tests.

```JSON
"duration": 5
```

#### Arrival rate (Optional)
You can select the arrival rate for your tests.

```JSON
"arrivalRate": 10
```

#### Artillery output (Optional)
You can have a `JSON` file with the result of the load testing used with [Artillery.io](https://artillery.io/),
at the end of the test the terminal is going to display a message explaining how to run this result. If it's not set it'll be
`false` by default.

```JSON
"withOutput": true/false
```

#### args

Here you should set all the arguments that might be used on the load testing, and also if 
`withMutations` is `true`, you should put the values used on the `mutation`.

**Note:** if you're going to use an array of string it should be created like this `"[\"a\", \"b\"]"`

### JSON file example
```json
{
  "config": {
    "url": "http://localhost:7000/",
    "name": "Testing my new server",
    "selectedQueries": ["createUser", "searchUser"],
    "queryFile": true,
    "withMutations": true,
    "duration": 5,
    "arrivalRate": 10,
    "withOutput": true
  },
  "args": {
    "getFamilyInfoByIsLocal": {
      "isLocal": true,
      "test": "[\"a\", \"b\"]",
      "age": 40,
      "name": "Demo Test"
    },
    "searchUser": {
      "name": "Demo User"
    },
    "createUser": {
      "name": "Demo User"
    },
    "createCity": {
      "input": {
        "name": "Demo Name",
        "country": "Demo Country"
      }
    }
  }
}
```

# License
### The MIT License

Copyright (c) 2019 EasyGraphQL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.