# Command Lines that Build a Project From Scratch

## Vue3 Project

``` terminal
// install vue-cli
npm install vue/cli -g

// check version
vue --version // @vue/cli 4.5.13

// create project
vue create [projectname]

// install dependencies
npm install

// start
npm run start

// build
npm run build
```

## Node Express Sequelize

``` terminal
// init npm
npm init

// install express nodemon(auto restart) sequelize(orm) sequelize-cli
npm install express -S nodemon -D sequelize -S sequelize-cli -D

// init sequelize
mkdir db
cd db
npx sequelize init

// now you have config files in db, add models into database
npx sequelize-cli model:generate --name Region --attributes name:string,manager_id:integer

// migrate to local database
npx sequelize-cli db:migrate [--env=development]

// init data
npx sequelize-cli seed:generate --name demo-access

// run seeds
npx sequelize-cli db:seed:all

```
