require("dotenv").config();
const chalk = require("chalk");

const Express = require("express");
const app = Express();
app.use(Express.json());

const dbConnection = require("./db");
const middlewares = require("./middleware");
const controllers = require("./controllers");

app.use("/user", controllers.UserController);

dbConnection
  .authenticate()
  .then(() => {
    dbConnection.sync();
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(chalk.yellowBright(`[Server: ] App is listening on Port ${process.env.PORT}`));
    });
  })
  .catch((err) => {
    console.error(chalk.redBright(err));
  });

app.use(middlewares.Headers);