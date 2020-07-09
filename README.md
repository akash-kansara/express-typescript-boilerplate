# Express TypeScript Boilerplate
[![GitHub version](https://badge.fury.io/gh/akash-kansara%2Fexpress-typescript-boilerplate.svg)](https://badge.fury.io/gh/akash-kansara%2Fexpress-typescript-boilerplate) [![Dependency Status](https://david-dm.org/akash-kansara/express-typescript-boilerplate.svg)](https://david-dm.org/akash-kansara/express-typescript-boilerplate) [![devDependency Status](https://david-dm.org/akash-kansara/express-typescript-boilerplate/dev-status.svg)](https://david-dm.org/akash-kansara/express-typescript-boilerplate#info=devDependencies) [![Build Status](https://travis-ci.com/akash-kansara/express-typescript-boilerplate.svg?branch=master)](https://travis-ci.com/akash-kansara/express-typescript-boilerplate) [![Coverage Status](https://coveralls.io/repos/github/akash-kansara/express-typescript-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/akash-kansara/express-typescript-boilerplate?branch=master)

This project attempts to provide a simple framework for API development using [express](https://github.com/expressjs/express) with the freedom of selecting and implementing any database.

## Application Business logic

This app implements a small retail store wherein store administrators can create users (customers), products and post a sale transaction. Each sale transaction record has an active user (customer) and active product.

## Project Structure logic

Core idea is to provide service definitions which conform to business logic as interfaces under src/service/ (service definitions). Service definitions may or may not be dependent on a persistent storage (database / external APIs / files) but if it they are, then persistent storage is implemented by implementing corresponding interface at src/repository/ (service repository). Similarly, business logic of a particular service definition is defined at src/controller/ (service controller). If persistent storage is required then service controller depends upon a service repository which implements the relevant service definition. Express APIs then directly use service controller objects.

For rest of things such as DB implementation, Swagger, etc. refer [Project structure](https://github.com/akash-kansara/express-typescript-boilerplate#project-structure)

#### Pictorial representation for a file management service with user authentication:
```
                                                            ┌---------------------------┐
                                                            |  Service Definition (SD)  |
                                                            |                           |
                                                            |            User           |
                                                            |      - getDetail()        |
                                                            |                           |
   ┌-----------┐    ┌--------------------------┐            |         FileHandler       |
   |     C     |    |            API           |            |      - upload()           |
   |     L     |    |       Depends on SC      |            |      - download()         |
   |     I     |    |                          |     ┌------|                           |------┐
   |     E     |◄---|   - /upload              |     |      |        Authenticate       |      |
   |     N     |    |      └FM.uploadAuth()    |     |      |      - authUser()         |      |
   |     T     |    |                          |     |      |                           |      |
   |           |    |  - /download             |     |      |         FileManager       |      |
   | Calls API |    |     └FM.downloadAuth()   |     |      |      - uploadAuth()       |      |
   └-----------┘    └--------------------------┘     |      |      - downloadAuth()     |      |
                                ▲                    |      |                           |      |
                                |                    |      └---------------------------┘      |
                                |                    ▼                                         ▼
                        ┌-------------------------------------------┐            ┌-------------------------------------------┐
                        |          Service Controller (SC)          |            |          Service Repository (SR)          |
                        |      Implements SD, may depend on SR      |            |  Implements SD, connects to other API, DB |
                        |                                           |            |                                           |
                        |            Authenticate (AUTH)            |◄-----------|               User (USR)                  |
                        |           - authUser()                    |            |           - getDetail()                   |
                        |             └USR.getDetail()              |            |             └Query Database               |
                        |                                           |            |                                           |
                        |              FileManager (FM)             |            |            FileHandler (FH)               |
                        |           - uploadAuth()                  |            |           - upload()                      |
                        |             └AUTH.authUser()              |            |             └Upload file to server        |
                        |              └FH.upload()                 |            |                                           |
                        |                                           |            |           - download()                    |
                        |           - downloadAuth()                |            |             └Download file from server    |
                        |             └AUTH.authUser()              |            └-------------------------------------------┘
                        |              └FH.download()               |
                        └-------------------------------------------┘
```

## Project structure
| Folder Path | Description |
| ------------- | ------------- |
| env/ | Environment files |
| logs/ | Logs directory |
| src/controller/ | Business Logic implementation of services defined in src/sevice/ |
| src/core/ | Basic functionalities required across the project |
| src/core/repository/ | Database implementation. Currently supports [MongoDB](https://www.mongodb.com/), [MySQL](https://www.mysql.com/) and [LokiJS](https://github.com/techfort/LokiJS) |
| src/di/ | Dependency injection configuration. Implemented using [inversify](https://www.npmjs.com/package/inversify) |
| src/entity/ | Class and Interface definitions |
| src/error-handler/ | Express error handler with custom error objects |
| src/event/ | Implement various event streams primarily for logging |
| src/middleware/ | Routers and Request handlers for managing [basic express security](https://expressjs.com/en/advanced/best-practice-security.html), authentication and authorization |
| src/repository/ | Repository implementation of services defined in src/sevice/ |
| src/routes/ | Express API definitions |
| src/service/ | Service definitions |
| src/swagger/ | [Swagger 2.0](https://swagger.io/docs/specification/2-0/basic-structure/) definition and API router |
| src/index | Handles server initialization and startup |
| test/ | Test scripts |
| test/api/ | API tests |
| test/di/ | Dependency injection configuration for controller and repository tests |
| test/controller/ | Controller tests |
| test/repository/ | Repository tests |
| test/rest/ | Tests using [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Not required. Not executed during `npm test`. |
| util/build.js | Utility to build project |
| nodemon.json | [Nodemon](https://github.com/remy/nodemon) configuration |
| package.json | Project dependencies |
| tsconfig.json | [Transpiling](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) configuration |
| tsconfig.prod.json | Production transpiling configuration |
| tslint.json | TS Linting rules |


## To start server, follow these steps

### Step 1: Install NodeJS & NPM

[NodeJS & NPM](https://nodejs.org/en/download/)

### Step 2: Get project
Clone this repository and go to this project's root location

### Step 3: Add global dependencies

```bash
npm i -g tsc ts-node ts-mocha tslint nodemon
```

### Step 4: Add local dependencies

```bash
npm i -D
```

### Step 5: Configure Database

Refer [DB configuration file](DB.md)

### Step 6: Run in dev environment

```bash
npm run start:dev
```

### Step 7: Check API

```bash
Open browser and go to http://localhost:3000/api-docs
```

### Step 8 (Optional): Run test cases

```bash
npm test
```

### Step 9: Build for production

```bash
npm run build
```

### Step 10: Run in production environment

```bash
npm start
```