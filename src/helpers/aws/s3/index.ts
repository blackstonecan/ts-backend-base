import { PutObjectCommand, DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommandInput } from "@aws-sdk/client-s3";

import Response from "../../response/Response";

import client from "./getClient";
import { generateRandomString } from "../../common/crypt";
import { base64ToBuffer } from "../../common/image";

const bucketName = process.env.S3_BUCKET;
const baseUrl = process.env.S3_BASE_URL;

const randomImageName = (bytes: number = 32): string => {
    const word: string = generateRandomString(bytes);
    const now: number = new Date().getTime();
    return `${word}-${now}`;
}

const uploadSingleFile = async ({
    tableName,
    fileBody
}: {
    tableName: string,
    fileBody: string
}): Promise<Response> => {
    try {
        const fileName = randomImageName();

        const responseBuffer = await base64ToBuffer(fileBody);
        if (!responseBuffer.success) return responseBuffer;

        const buffer = responseBuffer.data;

        const paramKey = `${tableName}/${fileName}`;

        const params: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: paramKey,
            Body: buffer,
            ContentLength: buffer.length,
        };

        const command = new PutObjectCommand(params);
        await client.send(command);

        const url = baseUrl + fileName;

        return Response.getSuccess(url);
    } catch (error: any) {
        return Response.getError(error);
    }
}

const deleteSingleFile = async (url: string): Promise<Response> => {
    try {
        const urlParts = url.split('/');

        const directory = urlParts[urlParts.length - 2];
        const fileName = urlParts[urlParts.length - 1];

        const paramKey = `${directory}/${fileName}`;

        const params: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: paramKey
        };

        const command = new DeleteObjectCommand(params);
        await client.send(command);

        return new Response(true);
    } catch (error: any) {
        return Response.getError(error);
    }
}

export {
    uploadSingleFile,
    deleteSingleFile
}