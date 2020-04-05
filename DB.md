## Database configuration for [Express Typescript Boilerplate](https://github.com/akash-kansara/express-typescript-boilerplate)

## Note
By default, this application connects to LokiJS DB in `dev` environment, MySQL in `staging` environment and MongoDB in `prod` environment. You can change to any database in any environment with either of the following options:

Option 1: Set following variables in env files located at env/<dev / staging / prod>.env

| Database | Variable |
| ------------- | ------------- |
| MongoDB | `REPOSITORY.DEFAULT=MONGO` |
| MySQL | `REPOSITORY.DEFAULT=MYSQL` |
| LokiJS | `REPOSITORY.DEFAULT=LOKI` |

Option 2: Set CLI argument while running the application
| Database | TS CLI Argument | Built JS CLI Argument |
| ------------- | ------------- | ------------- |
| MongoDB | `ts-node ./src -r MONGO` | `node ./dist -r MONGO` |
| MySQL | `ts-node ./src -r MYSQL` | `node ./dist -r MYSQL` |
| LokiJS | `ts-node ./src -r LOKI` | `node ./dist -r LOKI` |

## MongoDB config. Install MongoDB from [here](https://docs.mongodb.com/manual/administration/install-community/)

#### Step 1: Go to MongoDB Install path > bin > Open Terminal / CMD

#### Step 2: Open MongoDB CLI. Type following in Terminal / CMD:
```bash
mongo
```

#### Step 3: Create database. Type following in Terminal / CMD:
```bash
use test_db;
```

#### Step 4: Create user for database. Type following in Terminal / CMD:
```javascript
db.createUser({"user":"test_user","pwd":"test_pass","roles":[{"role":"userAdmin","db":"test_db"}]});
```

##

## MySQL config. Install MySQL from [here](https://dev.mysql.com/downloads/installer/)

#### Step 1: Go to MySQL Install path > bin > Open Terminal / CMD

#### Step 2: Open MySQL CLI. Type following in Terminal / CMD (Enter password when prompted):
```bash
mysql -u root -p
```

#### Step 3.1: Create database. Type following in Terminal / CMD:
```sql
CREATE DATABASE `express-typescript-boilerplate`;
```

#### Step 3.2: Switch database. Type following in Terminal / CMD:
```sql
USE `express-typescript-boilerplate`;
```

#### Step 4: Create user for database. Type following in Terminal / CMD:
```sql
CREATE USER 'node_user'@'%' IDENTIFIED WITH mysql_native_password BY 'node_user';
```

#### Step 5: Create tables. Type following in Terminal / CMD:
```sql
CREATE TABLE `app-refresh-tokens` (
  `refreshToken` text NOT NULL
);
CREATE TABLE `product_mst` (
  `code` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `desc` varchar(100) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`code`),
  UNIQUE KEY `code_UNIQUE` (`code`)
);
CREATE TABLE `sale_mst` (
  `productCode` varchar(20) NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `quantity` int NOT NULL
);
CREATE TABLE `user_mst` (
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email_UNIQUE` (`email`)
);
```
##

## No separate installation / config required for LokiJS database