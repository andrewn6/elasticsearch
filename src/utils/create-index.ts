import Elasticsearch from "../lib/elasticsearch";
import config from "../config";

const es = new Elasticsearch(process.env);

const esIndex = config.elasticsearch.index;

async function createIndex() {
	await es.deleteIndex(esIndex);

	await es.createIndex({
		index: esIndex,
		body: {
			// https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html

			mappings: {
				properties: {
					"@timestamp": { type: "date" },
					"@version": { type: "integer" },
					document_id: { type: "long" },
					title: { type: "text" },
					date: { type: "date" }, 
					language: { type: "keyword" }, 

					
					// https://www.elastic.co/guide/en/elasticsearch/reference/current/object.html
					metadata: {
						type: "object",
						properties: {
							// Similar as mapping propeties
						}
					},

		
					// https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html
					wikipedia: {
						type: "nested",
						properties: {
							// Similar as mapping properties
						}
					}
				}
			}
		}
	});
}

createIndex().catch((error) => {
	console.log(error);
});