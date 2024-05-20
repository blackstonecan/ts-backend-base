import { Pool, PoolConnection, createPool } from 'promise-mysql';

import Response from '../response/Response';

const pool: Promise<Pool> = createPool({
    host: process.env.MS_DB_HOST,
    user: process.env.MS_DB_USER,
    password: process.env.MS_DB_PASSWORD,
    database: process.env.MS_DB_NAME,
    port: Number(process.env.MS_DB_PORT),
    connectionLimit: 100
});

const query = async (text: string, params?: any[]): Promise<Response> => {
    let connection: PoolConnection | null = null;

    try {
        connection = await (await pool).getConnection();

        await connection.beginTransaction();

        const data = await connection.query(text, params);

        await connection.commit();

        return new Response(true, data);
    } catch (error: any) {
        try {
            if (connection) await connection.rollback();
        } catch (rollbackError: any) {
            console.log('Database rollback failed.', rollbackError);
        }

        return Response.getError(error);
    } finally {
        connection?.release();
    }
};

export default query;