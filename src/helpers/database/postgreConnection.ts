import { Pool } from 'pg';

import Response from '../response/Response';

const pool = new Pool({
  user: process.env.PG_DB_HOST,
  host: process.env.PG_DB_USER,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_DB_PASSWORD,
  port: Number(process.env.PG_DB_PORT),
});

const query = async (text: string, params: any[]) : Promise<Response> => {
  try {
    let response = await pool.query(text, params);
    return Response.getSuccess(response);
  } catch (error: any) {
    return Response.getError(error);
  }
};

export default query;