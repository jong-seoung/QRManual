import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { extname } from "path";

import type { SavedFile, StorageDriver } from "./storage.types";

// AWS S3에 저장.
// 환경변수:
// - AWS_REGION
// - S3_BUCKET
// - S3_PUBLIC_URL: 객체 접근 URL 프리픽스 (CloudFront 도메인 등)
// - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (또는 IAM role 사용)
@Injectable()
export class S3Storage implements StorageDriver {
  private readonly logger = new Logger(S3Storage.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(config: ConfigService) {
    const region = config.getOrThrow<string>("AWS_REGION");
    this.bucket = config.getOrThrow<string>("S3_BUCKET");
    this.publicUrl = (config.get<string>("S3_PUBLIC_URL") || `https://${this.bucket}.s3.${region}.amazonaws.com`).replace(/\/$/, "");
    this.client = new S3Client({
      region,
      // accessKeyId/secretAccessKey 미지정 시 SDK가 IAM role / env / shared config 자동 검색
    });
    this.logger.log(`S3Storage bucket=${this.bucket} region=${region}`);
  }

  async save(opts: {
    dir: string;
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<SavedFile> {
    const safeDir = opts.dir.replace(/[^a-zA-Z0-9_\-/]/g, "").replace(/^\/+|\/+$/g, "");
    const filename = `${randomId()}${extname(opts.originalName) || ""}`;
    const key = `${safeDir}/${filename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: opts.buffer,
        ContentType: opts.mimeType,
      }),
    );

    return {
      url: `${this.publicUrl}/${key}`,
      key,
      size: opts.buffer.length,
      mimeType: opts.mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (err) {
      this.logger.warn(`s3 delete ${key} failed: ${(err as Error).message}`);
    }
  }
}

function randomId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
