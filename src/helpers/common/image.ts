import sharp from "sharp";

import Response from "../response/Response";

const base64ToBuffer = async (base64: string): Promise<Response> => {
    try {
        const sizeReference = 1024000;
        const sizeLimit = sizeReference * 5;

        let buffer = Buffer.from(base64, "base64");

        const response = await resizeImageBySize(buffer, sizeLimit);
        if (!response.success) return response;

        buffer = response.data;

        if (buffer.length > sizeLimit) return Response.getMessageError("Image is too large", 400);

        return Response.getSuccess(buffer);
    } catch (error: any) {
        return Response.getError(error);
    }
}

const resizeImageBySize = async (buffer: Buffer, targetSize: number): Promise<Response> => {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        const imageMetadata = await sharp(buffer).metadata();
        if (!imageMetadata) return Response.getMessageError("Image is not valid", 400);

        const metaWidth = imageMetadata.width;
        const metaHeight = imageMetadata.height;
        if (!metaWidth || !metaHeight) return Response.getMessageError("Image is not valid", 400);

        const format = metadata.format;
        let resizedBuffer: Buffer = buffer;
        let quality = 95;
        let reductionFactor = 0.9;

        while (true) {
            if (format === 'jpeg') {
                resizedBuffer = await image
                    .jpeg({ quality: quality })
                    .toBuffer();
                quality -= 5;
            } else {
                const width = Math.round(metaWidth * reductionFactor);
                const height = Math.round(metaHeight * reductionFactor);

                let temp: sharp.Sharp = image.resize(width, height);

                if (format === 'png') temp = temp.png()

                resizedBuffer = await temp.toBuffer();
                reductionFactor -= 0.1;
            }

            if (resizedBuffer.length <= targetSize || (quality <= 1 && format === 'jpeg') || reductionFactor <= 0.1) break;
        }

        return Response.getSuccess(resizedBuffer);
    } catch (error: any) {
        return Response.getError(error);
    }
}

const getImageType = (buffer: Buffer): Response => {
    if (buffer.length < 4) {
        return Response.getMessageError("Image is not valid", 400);
    }

    let type: string;
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) type = 'image/png';
    else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) type = 'image/jpeg';
    else if (buffer[0] === 0x42 && buffer[1] === 0x4D) type = 'image/bmp';
    else return Response.getMessageError("Image type is not supported", 400);

    return Response.getSuccess(type);
}

export {
    base64ToBuffer,
    resizeImageBySize,
    getImageType
}