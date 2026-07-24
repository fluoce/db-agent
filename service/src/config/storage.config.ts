import { registerAs } from '@nestjs/config';

export const storageProvider = {
  S3: Symbol('AWS_S3'),
  R2: Symbol('CLOUDFLARE_R2'),
  local: Symbol('LOCAL'),
};

export const activeStorageProvider = storageProvider.local;

export const s3StorageConfig = registerAs('s3', () => ({
  region: process.env.S3_REGION!,
  bucketName: process.env.S3_BUCKET_NAME!,
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  url: process.env.S3_URL!,
}));

export const r2StorageConfig = registerAs('r2', () => ({
  accountId: process.env.R2_ACCOUNT_ID!,
  bucketName: process.env.R2_BUCKET_NAME!,
  endPoint: process.env.R2_ENDPOINT!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  url: process.env.R2_URL!,
}));

export const localStorageConfig = registerAs('local', () => ({
  path: process.env.STORAGE_PATH!,
}));

export const storageAccessUrls = () => ({
  S3: process.env.S3_URL!,
  R2: process.env.R2_URL!,
  local: process.env.STORAGE_PATH!,
});
