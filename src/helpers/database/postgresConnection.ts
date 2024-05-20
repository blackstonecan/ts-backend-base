import { Pool, PoolClient } from 'pg';

import Response from '../response/Response';

const pool = new Pool({
  user: process.env.PG_DB_USER,
  host: process.env.PG_DB_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_DB_PASSWORD,
  port: Number(process.env.PG_DB_PORT),
  max: 100
});

const query = async (text: string, params: any[]): Promise<Response> => {
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    await client.query('BEGIN');

    const data = await client.query(text, params);

    await client.query('COMMIT');

    return new Response(true, data);
  } catch (error: any) {
    try {
      if (client) await client.query('ROLLBACK');
    } catch (rollbackError: any) {
      console.log('Database rollback failed.', rollbackError);
    }

    return Response.getError(error);
  } finally {
    client?.release();
  }
};

export default query;