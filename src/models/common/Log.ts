import Response from "../../helpers/response/Response";
import query from "../../helpers/database";

class Log{
    static async save(routerId: number, input: any, output: any, status: number, success: boolean, actionerId?: number) : Promise<Response> {
        try {
            if(input) input = JSON.stringify(input);
            if(output) output = JSON.stringify(output);

            let columns = ["router_id", "actioner_id", "input", "output", "status", "success"];
            let values = [routerId, actionerId, input, output, status, success];

            let sql = `INSERT INTO log (${columns.join(", ")}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING *`;

            let result = await query(sql, values);
            if (!result.success) return Response.getMessageError("Failed to save log");

            if(!success){
                const insertId = result.data.rows[0].id;
               
                columns = ["log_id", "read"];
                values = [insertId, false];

                sql = `INSERT INTO error (${columns.join(", ")}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")})`;

                result = await query(sql, values);
                if(!result.success) return Response.getMessageError("Failed to save error");
            }

            return new Response(true);
        } catch (error: any) {
            return Response.getError(error);
        }
    }

    static async readError(id: number) : Promise<Response>{
        try {
            const sql = `UPDATE error SET read = $1 WHERE id = $2`;
            const values = [true, id];

            const result = await query(sql, values);
            if (!result.success) return Response.getMessageError("Failed to read error");

            return new Response(true);
        } catch (error: any) {
            return Response.getError(error);
        }
    }
}

export default Log;