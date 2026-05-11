import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { mkdir, unlink, writeFile } from "fs/promises";
import { extname, join, resolve } from "path";

import type { SavedFile, StorageDriver } from "./storage.types";

// 로컬 파일시스템에 저장.
// - UPLOAD_DIR: 디스크 경로 (디폴트 `./uploads`)
// - UPLOAD_BASE_URL: 외부에서 접근하는 URL 프리픽스 (디폴트 `http://localhost:8080/uploads`)
// 운영에서 nginx로 정적 서빙하는 경우 같은 prefix 유지.
@Injectable()
export class LocalStorage implements StorageDriver {
  private readonly logger = new Logger(LocalStorage.name);
  private readonly root: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.root = resolve(config.get<string>("UPLOAD_DIR") || "./uploads");
    this.baseUrl = (config.get<string>("UPLOAD_BASE_URL") || "http://localhost:8080/uploads").replace(/\/$/, "");
    this.logger.log(`LocalStorage root=${this.root} baseUrl=${this.baseUrl}`);
  }

  async save(opts: {
    dir: string;
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<SavedFile> {
    const safeDir = sanitizeDir(opts.dir);
    const targetDir = join(this.root, safeDir);
    await mkdir(targetDir, { recursive: true });

    const filename = `${randomId()}${extname(opts.originalName) || ""}`;
    const targetPath = join(targetDir, filename);
    await writeFile(targetPath, opts.buffer);

    const key = `${safeDir}/${filename}`;
    return {
      url: `${this.baseUrl}/${key}`,
      key,
      size: opts.buffer.length,
      mimeType: opts.mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    if (key.includes("..")) return; // 경로 공격 방지
    const target = join(this.root, key);
    try {
      await unlink(target);
    } catch (err) {
      // 이미 없는 파일이면 무시
      this.logger.warn(`delete ${key} failed: ${(err as Error).message}`);
    }
  }
}

function sanitizeDir(dir: string): string {
  return dir.replace(/[^a-zA-Z0-9_\-/]/g, "").replace(/^\/+|\/+$/g, "");
}

function randomId(): string {
  // crypto.randomUUID 대신 Node의 Crypto API 직접 — 짧은 hex로 충분
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
