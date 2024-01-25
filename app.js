require("dotenv").config();
const helmet = require('helmet');

const Express = require("express");
const cors = require("cors");
const app = Express();
app.use(Express.json());

const dbConnection = require("./db");
const middlewares = require("./middleware");
const controllers = require("./controllers");

app.use(cors());
app.use(helmet());
app.use("/user", controllers.UserController);
app.use("/admin", controllers.AdminController);
app.use("/book", controllers.BookController);
app.use("/tag", controllers.TagController);
app.use("/review", middlewares.ValidateSession, controllers.ReviewController);
app.use("/chapter", middlewares.ValidateSession, controllers.ChapterController);

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
    console.error(err);
  });

app.use(middlewares.Headers);