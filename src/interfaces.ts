/* eslint-disable linebreak-style */
export interface IGenericJSON { [key: string]: never; }
export type IGenericExecFunc = (value?: never) => never;
export type IGenericCallbackFunc = (error: Error, value?: never) => never; 

export interface IConfigCommon {
    environment: string,
    isProduction: boolean
}

export interface IConfigENV {
  port: number,
  sessionSeceret?: string,
  elasticsearch: {
    node: string,
    index: string
  }
}

export interface IConfiguration {
  environment?: string,
  isProduction?: boolean,
  port: number,
  sessionSeceret?: string,
  elasticsearch: {
    node: string,
    index: string
  }
}

export interface IPostgreSQLParams {
  user: string;
  database: string;
  password: string;
  host: string;
  port: number;
  max: number;
  idleTimeoutMillis: number;
  schema: string;
  version: string;
}

export type IPostgreSQLBatchCallbackFunc = (error: Error, rows: never[], callback: IGenericCallbackFunc) => void;

export interface ISearch {
  text?: string,
  limit?: number,
  page?: number,
}

export interface IQueryElement {
  term?: object,
  terms?: object,
  regexp?: object,
  exists?: object,
  range?: object,
}