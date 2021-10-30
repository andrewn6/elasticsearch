import { Express } from "express";
import { IConfiguration  } from "../interfaces";

import documents from "./documents";

export default function index(app: Express, config: IConfiguration) {
	app.use("/api/v1", documents(config));
}