# Elastic Search TypeScript Template

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
- Set up the config file, you can create a .env file in the root directory (Copy from env.example and set your secrets).
- Update the indexing script to create and populate data in the elasticsearch index, 
you can modify the create-elasticsearch-index.ts file in src/scripts to speed up the process.
- Once the index is all setup and populated, you must update the elastic search route located src/routes/index.ts.

# Starting the app
Once you are done following the details above, you can run the app.
`yarn server:start`

Or start it in development mode to take advantage of nodemon
> Note, nodemon is already a part of this service, but it can simply be used by running this command below.
`yarn run server:dev`
