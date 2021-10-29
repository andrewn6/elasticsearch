import * as Interfaces from "./interfaces";

import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../env/.env") });

const env = process.env.NODE_ENV || "development";

const common = {
	environment: env,
	isProduction: env === "production"
};

const production = {
	port: parseInt(process.env.PROD_PORT, 10) || 3100,
	sessionsecret: process.env.PROD_SESSION_SECRET,
	elasticsearch: {
		node: process.env.PROD_ELASTICSEARCH_NODE,
		index: process.env.PROD_ELASTICSEARCH_INDEX
	}
};

const development = {
	port: parseInt(process.env.DEV_PORT, 10) || 3101,
	sessionsecret: process.env.DEV_SESSION_SECRET,
	elasticsearch: {
		node: process.env.DEV_ELASTICSEARCH_NODE,
		index: process.env.PROD_ELASTICSEARCH_INDEX
	}
};

const test = {
	port: parseInt(process.env.TEST_PORT, 10) || 3102,
	sessionsecret: process.env.TEST_SESSION_SECRET,
	elasticsearch: {
		node: process.env.TEST_ELASTICSEARCH_NODE,
		index: process.env.PROD_ELASTICSEARCH_INDEX
	}
};

const envGroups = {
	production,
	development,
	test
};

function merge(target: Interfaces.IConfigCommon, source: Interfaces.IConfigENV): Interfaces.IConfiguration {
	for (const key of Object.keys(source)) {
		if (source[key] instanceof Object && !Array.isArray(source[key])) {
			Object.assign(source[key], merge(target[key], source[key]));
		}
	}
	return Object.assign(target || {}, source);
}

const config = merge(common, envGroups[env]);
export default config;