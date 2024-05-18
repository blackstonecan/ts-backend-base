import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const {
    S3_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_KEY
} = process.env;

if (!S3_REGION || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
    throw new Error('Missing required environment variables for AWS S3 configuration');
}

const s3ClientConfig: S3ClientConfig = {
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
    region: S3_REGION,
};

const client = new S3Client(s3ClientConfig);

export default client;