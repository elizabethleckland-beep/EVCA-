
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const s3Util = {
  /* FIX: Using any type for buffer as Node types are not globally available in this context */
  async uploadFile(buffer: any, key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || 'evca-incident-uploads',
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    return s3Client.send(command);
  },

  async getPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET || 'evca-incident-uploads',
      Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  },

  async getFileSnippet(key: string, charLimit: number = 400) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET || 'evca-incident-uploads',
      Key: key,
    });
    const response = await s3Client.send(command);
    const bodyString = await response.Body?.transformToString();
    return bodyString?.substring(0, charLimit) || "";
  }
};