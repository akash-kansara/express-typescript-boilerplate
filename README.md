# Express TypeScript Boilerplate

This project attempts to provide a simple framework for API development using [express](https://github.com/expressjs/express).

## Project structure
| Folder Path | Description |
| ------------- | ------------- |
| env/ | Environment files |
| logs/ | Logs directory |
| src/controller/ | API Controller implementation of services defined in src/sevice/ |
| src/core/ | Generic functions required across the project |
| src/core/repository/ | Database implementation. Currently supports [MongoDB](https://www.mongodb.com/) and [LokiJS](https://github.com/techfort/LokiJS). |
| src/entity/ | Class and Interface definitions |
| src/error-handler | Express error handler with custom error objects |
| src/event | Implement various event streams. Primarily for logging. |
| src/middleware/ | Routers and Request handlers for managing [basic express security](https://expressjs.com/en/advanced/best-practice-security.html), authentication and authorization |
| src/repository/ | Repository implementation of services defined in src/sevice/ |
| src/routes/ | Express API definitions |
| src/service/ | Service definitions |
| src/swagger | [Swagger 2.0](https://swagger.io/docs/specification/2-0/basic-structure/) definition |
| src/index | Handles server initialization and startup |
| test/ | Test scripts |
| util/build.js | Utility to build project |
| logs/ | Logs directory  |
| nodemon.json | [Nodemon](https://github.com/remy/nodemon) configuration |
| package.json | Project dependencies |
| tsconfig.json | [Transpiling](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) configuration |
| tsconfig.prod.json | Production transpiling configuration |
| tslint.json  | TS Linting rules |


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

### Step 5: Run in dev environment

```bash
npm run start:dev
```

### Step 6: Check API

```bash
Open browser and go to http://localhost:3000/api-docs
```

### Step 7 (Optional): Run test cases

```bash
npm test
```

### Step 8: Build for production

```bash
npm run build
```

### Step 9: Run in production environment

```bash
npm start
```
## Upcoming changes
1. Test cases to test API Controllers and Repositiory impentations
2. Combine all test cases