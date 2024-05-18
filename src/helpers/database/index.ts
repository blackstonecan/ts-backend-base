import { Pool } from 'pg';

import Response from '../response/Response';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'database',
  password: 'password',
  port: 5432,
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