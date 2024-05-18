import CustomError from "../../helpers/error/CustomError";
import Response from "../../helpers/response/Response";

import query from "../../helpers/database";
import { uploadSingleFile } from "../../helpers/aws/s3";
import { getImageType, base64ToBuffer } from "../../helpers/common/image";

class FileType {
    id?: number;
    url: string;
    type: string;

    constructor({ id, url, type }: {
        id?: number,
        url: string,
        type: string
    }) {
        this.id = id;
        this.url = url;
        this.type = type;
    }

    static async fromBase64(base64: string, tableName: string): Promise<Response> {
        try {
            let response = await base64ToBuffer(base64);
            if (!response.success) return response;

            const buffer = response.data;

            response = getImageType(buffer);
            if (!response.success) return response;

            const type = response.data;
            
            response = await uploadSingleFile({ tableName, fileBody: base64 });
            if (!response.success) return response;

            const url = response.data;

            return Response.getSuccess(new FileType({ url, type }));
        } catch (error: any) {
            return Response.getError(error);
        }
    }

    static async fromId(id: number): Promise<Response> {
        try {
            const sql = `SELECT * FROM file WHERE id = $1`;
            const values = [id];

            const response = await query(sql, values);
            if (!response.success) return response;
            if (!response.data.rows[0]) return Response.getMessageError("File not found", 404);

            const { url, type } = response.data.rows[0];

            return Response.getSuccess(new FileType({ id, url, type }));
        } catch (error: any) {
            return Response.getError(error);
        }
    }

    async save(): Promise<Response> {
        try {
            const sql = `INSERT INTO file (url, type) VALUES ($1, $2) RETURNING *`;
            const values = [this.url, this.type];

            const response = await query(sql, values);
            if (!response.success) return response;
            if (!response.data.rows[0]) return Response.getMessageError("File not saved");

            this.id = response.data.rows[0].id;

            return new Response(true);
        } catch (error: any) {
            return Response.getError(error);
        }
    }
}

export default FileType;