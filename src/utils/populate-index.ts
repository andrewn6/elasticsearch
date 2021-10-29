import ElasticSearch from "../lib/elasticsearch";
import config from "../config";

const es = new ElasticSearch(config.elasticsearch);

const esIndex = config.elasticsearch.index;


const documents = [];

async function createIndex() {
	const indexDocuments = [];
  
	for (const document of documents) {
		indexDocuments.push(es.pushRecord(esIndex, document));
	}
	await Promise.all(indexDocuments);

	await es.refreshIndex(esIndex);
}

createIndex().catch((error) => {
	console.log(error);
});