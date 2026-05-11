import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { STORAGE, type StorageDriver } from "@/common/storage/storage.types";
import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type ManualPdf, manualPdfs } from "@/db/schema/manual-pdfs";
import type { User } from "@/db/schema/users";
import { ManualsService } from "@/manuals/manuals.service";

const ALLOWED_MIME = new Set(["application/pdf"]);

@Injectable()
export class ManualPdfsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    @Inject(STORAGE) private readonly storage: StorageDriver,
    private readonly manuals: ManualsService,
  ) {}

  async listByManual(manualId: number): Promise<ManualPdf[]> {
    return this.db.query.manualPdfs.findMany({
      where: eq(manualPdfs.manualId, manualId),
      orderBy: [desc(manualPdfs.createdAt)],
    });
  }

  async findById(id: number): Promise<ManualPdf> {
    const pdf = await this.db.query.manualPdfs.findFirst({ where: eq(manualPdfs.id, id) });
    if (!pdf) throw new NotFoundException("Manual PDF not found");
    return pdf;
  }

  async create(
    actor: User,
    manualId: number,
    file: Express.Multer.File,
    meta: { language: string; title?: string },
  ): Promise<ManualPdf> {
    await this.manuals.assertCanModify(actor, manualId);

    if (!file || !file.buffer?.length) {
      throw new BadRequestException("파일이 비어있습니다");
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(`허용되지 않는 파일 형식: ${file.mimetype}`);
    }

    const saved = await this.storage.save({
      dir: "manuals",
      originalName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    });

    try {
      const [created] = await this.db
        .insert(manualPdfs)
        .values({
          manualId,
          language: meta.language,
          title: meta.title,
          pdfUrl: saved.url,
          storageKey: saved.key,
          originFileName: file.originalname,
          mimeType: file.mimetype,
          fileSize: saved.size,
        })
        .returning();
      return created;
    } catch (err) {
      void this.storage.delete(saved.key);
      throw err;
    }
  }

  async update(
    actor: User,
    id: number,
    patch: { language?: string; title?: string },
  ): Promise<ManualPdf> {
    const pdf = await this.findById(id);
    await this.manuals.assertCanModify(actor, pdf.manualId);

    const [updated] = await this.db
      .update(manualPdfs)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(manualPdfs.id, id))
      .returning();
    return updated;
  }

  async remove(actor: User, id: number): Promise<void> {
    const pdf = await this.findById(id);
    await this.manuals.assertCanModify(actor, pdf.manualId);

    await this.db.delete(manualPdfs).where(eq(manualPdfs.id, id));
    await this.storage.delete(pdf.storageKey);
  }
}
