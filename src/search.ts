/* Main file to run the service */

import * as  express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

import { handleError, ErrorHandler } from "./lib/error";
import logging from "./middleware/logging";

const app = express();

app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "15mb"
}));
app.use(cookieParser(process.env.sessionsecret))

if(process.env.isProduction) {
  app.set("Trust proxy", 1);
}

app.use(logging(
  "elasticsearch",
  "INFO",
  process.env.isProduction,
));

app.use("*", (req, res, next) => {
  next(new ErrorHandler(404, "Route not Found!"));
});

app.use((err: ErrorHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
  return handleError(err, res);
});

const server = app.listen(process.env.PORT);

module.exports = server;