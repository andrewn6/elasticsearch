import { IConfiguration, ISearch } from "../interfaces";
import { ErrorHandler } from "../lib/error";
import ElasticSearch from "../lib/elasticsearch";

import { Router, Request, Response } from "express";
import { NextFunction  } from "express";
import { query, param } from "express-validator";
import * as querystring from "querystring";

const router = Router();

export function materialFormat(hit: never) {
	return {
		weight: hit
	};
}

export default (config: IConfiguration) => {
	const es = new ElasticSearch(config.elasticsearch);

	const DEFAULT_LIMIT = 20;
	const MAX_LIMIT = 100;
	const DEFAULT_PAGE = 1;
	const BASE_URL = `http://localhost:${config.port}/api/v1/search`;
	const esIndex = config.elasticsearch.index;

	router.get("/documents", [
		query("text").trim(),
		query("limit").optional().toInt(),
		query("page").optional().toInt()
	], async (req: Request, res: Response, next: NextFunction) => {
		const requestQuery: ISearch = req.query;
		const {
			text,
			limit: queryLimit,
			page: queryPage
		} = requestQuery;

		if (!text) {
			return res.status(400).json({
				message: "query paramater 'text is not available",
				query: requestQuery
			});
		}

		const limit: number = !queryLimit
			? DEFAULT_LIMIT 
			: queryLimit <= 0
				? DEFAULT_LIMIT 
				: queryLimit >= MAX_LIMIT
					? DEFAULT_LIMIT 
					: queryLimit;
    
		const page: number = !queryPage
			? DEFAULT_PAGE 
			: queryLimit;
    
    
		const size = limit;
		const from = (page - 1) * size;


		/* Query paramaters*/
		const body = {
			from,
			size,
			_source: {
				excludes: []
			},
			query: {
				bool: {
					must: [{ }],
					should: [{ }],
					must_not: [{ }]
				},
				filter: [{ }]
			},
			track_total_hits: true
		};

		try {
			const results = await es.search(esIndex, body);

			const output = results.hits.hits.map(materialFormat);

			const prev = {
				...req.query,
				...page && { page: page - 1}
			};

			const nextQuery = {
				...req.query,
				...page && { page: page + 1}
			};

			const total_hits = results.hits.total.value;
			const total_pages = Math.ceil(results.hits.total.value / size);
			const prev_page = page - 1 > 0 ? `${BASE_URL}?${querystring.stringify(prev)}` : null;
			const next_page =total_pages >= page + 1 ? `${BASE_URL}?${querystring.stringify(nextQuery)}` : null;

			return res.status(200).json({
				query: req.query,
				documents: output,
				metadata: {
					total_hits,
					total_pages,
					prev_page,
					next_page,
				}
			});
		} catch (error) {
			return next(new ErrorHandler(500, "Internal server error"));
		}
	});

	router.post("/documents", async (req, res, next) => {
		const {
			body: {
				document
			} 
		} = req;

		try {
			await es.pushRecord(esIndex, document);

			await es.refreshIndex(esIndex);
			return res.status(200).json({
				message: "Document pushed to ES index"
			});
		} catch (error) {
			return next(new ErrorHandler(500, "Internal server error"));
		}
	});
    
	router.get("/documents/:document_id", [
		param("document_id").toInt()
	], async (req, res, next) => {
		const {
			params: {
				document_id
			}
		} = req;
		if (!document_id) {
			return res.status(400).json({
				message: "Body paramater document_id is not an integer",
				query: { document_id }
			});
		}

		const body = {
			query: { terms: { _id: [document_id] } }
		};

		try {
			const results = await es.search(esIndex, body);
			const output = results.hits.hits.map(materialFormat)[0];

			return res.status(200).json({
				params: req.params,
				documents: output
			});
		} catch (error) {
			return next(new ErrorHandler(500, "Internal server error."));
		}
	}); 

	router.patch("/documents/:document_id", [
		param("document_id").toInt()
	], async (req, res, next) => {
		const {
			params: { document_id },
			body: { document }
		} = req;

		if (!document_id) {
			return res.status(400).json({
				message: "Body paramater document_id is not an integer",
				query: { document_id }
			});
		}

		try {
			await es.updateRecord(esIndex, document_id, document);
			await es.refreshIndex(esIndex);
			return res.status(200).json({
				message: "Document updated to the index. "
			});
		} catch (error) {
			return next(new ErrorHandler(500, "Internal server error."));
		}
	});
    
	router.delete("/document/:document_id", [
		param("document_id").toInt()
	], async (req, res, next) => {
		const {
			params: { document_id }
		} = req;

		try {
			await es.deleteRecord(esIndex, document_id);
			await es.refreshIndex(esIndex);

			return res.status(200).json({
				message: "Record deleted in the index"
			});
		} catch (error) {
			return next(new ErrorHandler(500, "Internal server error."));
		}
	});

	return router;
};