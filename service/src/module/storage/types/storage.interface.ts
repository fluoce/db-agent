export interface StorageService {
  preSignedUrl(params: {
    key: string;
    mimeType: string;
  }): Promise<string | null>;
  putObject(params: {
    key: string;
    buffer: Buffer;
    contentType: string;
  }): Promise<string | null>;
  getObject(params: { key: string }): Promise<Buffer | null>;
  deleteObject(params: { key: string }): Promise<string | null>;
  exists(params: { key: string }): Promise<boolean>;
}
