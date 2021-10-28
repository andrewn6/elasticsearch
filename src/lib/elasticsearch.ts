import { Client, ClientOptions, RequestParams } from "elasticsearch";

export default class Elasticsearch {

	private params: ClientOptions;
	private client: Client;

	constructor(params: ClientOptions) {
		this.params = params;
    this.initializeClient();
	}

  initializeClient() {
    this.client = new Client({
      node: this.params.node
    });
  }

  async createIndex(schema: RequestParams.IndicesCreate) {
    return await this.client.indices.create(schema);
  }

  async deleteIndex(index: string) {
    const { body: exists } = await this.client.indcies.exists({ index });
    if ( exists ) {
      return await this.client.indices.delete({ index });
    }
    return null;
  }

  async refreshIndex(index: string) {
    return await this.client.indices.refresh({ index });
  }

  async pushRecord(index: string, body: object, recordId = null) {
    return await this.client.index({
      ...recordId && { id: recordId },
      index,
      body
    });
  }

  async updateRecord(index: string, recordId: string, body: object) {
    return await this.client.update({
      index,
      type: "_doc",
      id: recordId,
      body: { doc: body }
    });
  }

  async deleteRecord(index: string, recordID: string) {
    return await this.client.delete({
      id: recordID,
      index
    });
  }

  async search(index: string, schema: object) {
    const { body } = await this.client.search({
      index,
      body: schema
    });
    return body;
  }
}