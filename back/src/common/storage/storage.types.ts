export interface SavedFile {
  /** 풀 공개 URL — DB에 그대로 저장 */
  url: string;
  /** 드라이버별 키 (로컬은 상대 경로, S3는 object key). 삭제용 */
  key: string;
  size: number;
  mimeType: string;
}

export interface StorageDriver {
  save(opts: {
    dir: string; // 'manuals', 'manual-images' 등
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<SavedFile>;

  delete(key: string): Promise<void>;
}

export const STORAGE = Symbol("STORAGE");
