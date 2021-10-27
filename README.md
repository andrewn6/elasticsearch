# Elastic Search Typescript Template

This is a template repository for setting up NodeJS/Typescript & connecting it to ElasticSearch.

# Requirements
- Elastic search service (download it [here](https://www.elastic.co/downloads/elasticsearch))
- Node 12 & up
  > You can check which node version you have via `node --version` in your terminal.

# Install
To install the project run:
`yarn install`

# Setting up the service
After installing the dependecies, you must modify a few files to meet the requirements:
- Set up the config file, you can create a .env file in the root directory.
- Update the indexing script to create and populate data in the elasticsearch index, 
you can modify the create-elasticsearch-index.ts file in src/scripts to speed up the process.
- Once the index is all setup and populated, you must update the elastic search route located src/routes/index.ts.

# Starting the app
Once you are done following the details above, you can run the app.
`yarn start`

Or start it in development mode
`yarn run development`"# es-typescript" 
