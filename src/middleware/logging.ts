import * as ITransport from "winston-transport";

import * as winston from "winston";
import * as expressWinston from "express-winston";

import DailyRotateFile = require("winston-daily-rotate-file");

import * as path from "path";
import * as fileSystem from "../lib/file";

import { ErrorHandler } from "../lib/error";

const transportCreator = (filename: string, dirname: string, level: string) => {
  if (!filename) {
    throw new ErrorHandler(500, "Internal Server Errror");
  }

  return new (DailyRotateFile)({
    filename,
    dirname,
    datePattern: "YYYY-MM-DD",
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  });
};

const createTransports = (filename: string, folder: string, level="INFO", consoleFlag=true) => {
  const transports: ITransport[] = [];

  if (consoleFlag) {
    transports.push(new winston.transports.Console({
      level,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
      )
    }));
  }
  transports.push(transportCreator(filename, folder, level));
  return transports;
};

export default (filename: string, level="INFO", consoleFlag=true) => {
  const folder = path.join(__dirname, "../../logs");
  fileSystem.createDirectoryPath(folder);
  const transports = createTransports(filename, folder, level, consoleFlag);
  return expressWinston.logger({
    transports,
    meta: false,
    expressFormat: true,
    ignoreRoute: (req, res) => false
  });
 };