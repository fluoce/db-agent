import { Module } from '@nestjs/common';
import { S3StorageService } from './aws/s3-storage.service';
import { R2StorageService } from './cloudflare/r2-storage.service';
import {
  localStorageConfig,
  r2StorageConfig,
  s3StorageConfig,
  storageProvider,
} from 'src/config/storage.config';
import { LocalStorageService } from './local/local-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(s3StorageConfig),
    ConfigModule.forFeature(r2StorageConfig),
    ConfigModule.forFeature(localStorageConfig),
  ],
  providers: [
    S3StorageService,
    R2StorageService,
    LocalStorageService,
    {
      provide: storageProvider.S3,
      useExisting: S3StorageService,
    },
    {
      provide: storageProvider.R2,
      useExisting: R2StorageService,
    },
    {
      provide: storageProvider.local,
      useExisting: LocalStorageService,
    },
  ],
  exports: [storageProvider.S3, storageProvider.R2, storageProvider.local],
})
export class StorageModule {}
