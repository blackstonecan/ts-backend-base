import mysql, { Pool } from 'promise-mysql';

import Response from '../response/Response';

const pool: Promise<Pool> = mysql.createPool({
    host: process.env.MS_DB_HOST,
    user: process.env.MS_DB_USER,
    password: process.env.MS_DB_PASSWORD,
    database: process.env.MS_DB_NAME,
    port: Number(process.env.MS_DB_PORT),
    connectionLimit: 100
});

const query = async (text: string, params?: any[]): Promise<Response> => {
    let connection: mysql.PoolConnection | undefined;

    try {
        connection = await (await pool).getConnection();

        await connection.beginTransaction();

        const data = await connection.query(text, params);

        await connection.commit();

        return new Response(true, data);
    } catch (error: any) {
        if (connection) await connection.rollback();
        return Response.getError(error);
    } finally {
        if (connection) connection.destroy();
    }
};

export default query;