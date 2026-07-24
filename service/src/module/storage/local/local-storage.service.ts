import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../types/storage.interface';
import { localStorageConfig } from 'src/config/storage.config';
import type { ConfigType } from '@nestjs/config';
import { funcTryCatch } from 'src/func/func-try-catch';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const fsAccess = promisify(fs.access);
const fsWriteFile = promisify(fs.writeFile);
const fsReadFile = promisify(fs.readFile);
const fsUnlink = promisify(fs.unlink);
const fsMkdir = promisify(fs.mkdir);

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly basePath: string;

  constructor(
    @Inject(localStorageConfig.KEY)
    private readonly config: ConfigType<typeof localStorageConfig>,
  ) {
    this.basePath = config.path;
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async preSignedUrl({
    key,
  }: {
    key: string;
    mimeType: string;
  }): Promise<string> {
    return path.join(this.basePath, key);
  }

  async putObject({
    key,
    buffer,
  }: {
    key: string;
    buffer: Buffer;
    contentType: string;
  }): Promise<string | null> {
    const filePath = path.join(this.basePath, key);
    await funcTryCatch({
      func: async () => {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          await fsMkdir(dir, { recursive: true });
        }
        await fsWriteFile(filePath, buffer);
      },
      action: `local_putObject_key_${key}`,
      logger: this.logger,
    });
    return key;
  }

  async getObject({ key }: { key: string }): Promise<Buffer | null> {
    const filePath = path.join(this.basePath, key);
    return funcTryCatch<Buffer | null, null>({
      func: async () => {
        return await fsReadFile(filePath);
      },
      action: `local_getObject_key_${key}`,
      logger: this.logger,
    });
  }

  async deleteObject({ key }: { key: string }): Promise<string | null> {
    const filePath = path.join(this.basePath, key);
    const result = await funcTryCatch({
      func: async () => {
        await fsUnlink(filePath);
      },
      action: `local_deleteObject_key_${key}`,
      logger: this.logger,
    });
    if (result === null) {
      return null;
    }
    return key;
  }

  async exists({ key }: { key: string }): Promise<boolean> {
    const filePath = path.join(this.basePath, key);
    const result = await funcTryCatch({
      func: async () => {
        await fsAccess(filePath, fs.constants.F_OK);
      },
      action: `local_exists_key_${key}`,
      logger: this.logger,
    });
    return result === undefined;
  }
}
