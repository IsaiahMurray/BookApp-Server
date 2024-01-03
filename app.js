require("dotenv").config();
const helmet = require('helmet');

const Express = require("express");
const app = Express();
app.use(Express.json());

const dbConnection = require("./db");
const middlewares = require("./middleware");
const controllers = require("./controllers");

app.use(helmet());
app.use("/user", controllers.UserController);

dbConnection
  .authenticate()
  .then(() => {
    dbConnection.sync();
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`[Server: ] App is listening on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(chalk.redBright(err));
  });

app.use(middlewares.Headers);