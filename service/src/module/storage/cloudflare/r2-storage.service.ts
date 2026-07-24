import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../types/storage.interface';
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  type GetObjectCommandOutput,
  type PutObjectCommandOutput,
  type DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { r2StorageConfig } from 'src/config/storage.config';
import type { ConfigType } from '@nestjs/config';
import { funcTryCatch } from 'src/func/func-try-catch';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class R2StorageService implements StorageService {
  private readonly client: S3Client;

  private readonly logger = new Logger(R2StorageService.name);

  constructor(
    @Inject(r2StorageConfig.KEY)
    private readonly config: ConfigType<typeof r2StorageConfig>,
  ) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: config.endPoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async preSignedUrl({
    key,
    mimeType,
  }: {
    key: string;
    mimeType: string;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      ContentType: mimeType,
    });
    return await getSignedUrl(this.client, command, {
      expiresIn: 120,
    });
  }

  async putObject({
    key,
    buffer,
    contentType,
  }: {
    key: string;
    buffer: Buffer;
    contentType: string;
  }): Promise<string | null> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    const result = await funcTryCatch<PutObjectCommandOutput, null>({
      func: () => this.client.send(command),
      action: `r2_putObject_key_${key}`,
      logger: this.logger,
    });
    if (!result || !result?.ETag) {
      return null;
    }
    return key;
  }

  async getObject({ key }: { key: string }): Promise<Buffer | null> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });
    const result = await funcTryCatch<GetObjectCommandOutput, null>({
      func: () => this.client.send(command),
      action: `r2_getObject_key_${key}`,
      logger: this.logger,
    });
    if (!result || !result?.Body) {
      return null;
    }
    return await funcTryCatch<Buffer | null, null>({
      func: async () => {
        const byteArray = await result.Body?.transformToByteArray();
        if (!byteArray) return null;
        return Buffer.from(byteArray);
      },
      action: `r2_getObject_body_to_buffer_key_${key}`,
      logger: this.logger,
    });
  }

  async deleteObject({ key }: { key: string }): Promise<string | null> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });
    const result = await funcTryCatch<DeleteObjectCommandOutput, null>({
      func: async () => this.client.send(command),
      action: `r2_deleteObject_key_${key}`,
      logger: this.logger,
    });
    if (!result) {
      return null;
    }
    return key;
  }

  async exists({ key }: { key: string }): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    const result = await funcTryCatch({
      func: () => this.client.send(command),
      action: `r2_headObject_key_${key}`,
      logger: this.logger,
    });

    return !!result;
  }
}
