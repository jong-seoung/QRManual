import { Controller, Get, Inject, NotFoundException, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { eq } from "drizzle-orm";

import { Public } from "@/auth/decorators/public.decorator";
import { CustomerServiceResponseDto } from "@/customer-services/dto/customer-service.dto";
import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { companies } from "@/db/schema/companies";
import { manualPdfs } from "@/db/schema/manual-pdfs";
import { customerServices, faqs, parts } from "@/db/schema/manual-extras";
import { FaqResponseDto } from "@/faqs/dto/faq.dto";
import { ManualPdfResponseDto } from "@/manual-pdfs/dto/manual-pdf.dto";
import { PartResponseDto } from "@/parts/dto/part.dto";

import { ListManualsQueryDto, ManualResponseDto } from "./dto/manual.dto";
import { ManualsService } from "./manuals.service";

interface PublicCompanyDto {
  id: number;
  name: string;
  officialMark: boolean;
  homePage: string | null;
}

interface PublicManualPayload {
  manual: ManualResponseDto;
  company: PublicCompanyDto;
  pdfs: ManualPdfResponseDto[];
  parts: PartResponseDto[];
  faqs: FaqResponseDto[];
  customerService: CustomerServiceResponseDto | null;
}

@ApiTags("public-manuals")
@Controller("api/public/manuals")
export class PublicManualsController {
  constructor(
    private readonly manuals: ManualsService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "공개 매뉴얼 카탈로그 (인증 불필요)" })
  async list(@Query() q: ListManualsQueryDto) {
    const result = await this.manuals.list({
      page: q.page ?? 0,
      size: q.size ?? 20,
      keyword: q.keyword,
      companyId: q.companyId,
    });
    return {
      items: result.items.map(ManualResponseDto.from),
      total: result.total,
      page: result.page,
      size: result.size,
    };
  }

  // QR 스캔 진입점 — 인증 없이 매뉴얼·회사·PDF·부품·FAQ·고객센터 통합 반환.
  @Public()
  @Get(":id")
  @ApiOperation({ summary: "공개 매뉴얼 페이지 데이터 (인증 불필요)" })
  async detail(@Param("id", ParseIntPipe) id: number): Promise<PublicManualPayload> {
    const manual = await this.manuals.findById(id);

    const [company, pdfList, partList, faqList, cs] = await Promise.all([
      this.db.query.companies.findFirst({ where: eq(companies.id, manual.companyId) }),
      this.db.query.manualPdfs.findMany({ where: eq(manualPdfs.manualId, manual.id) }),
      this.db.query.parts.findMany({ where: eq(parts.manualId, manual.id) }),
      this.db.query.faqs.findMany({ where: eq(faqs.manualId, manual.id) }),
      this.db.query.customerServices.findFirst({ where: eq(customerServices.manualId, manual.id) }),
    ]);

    if (!company) throw new NotFoundException("Company not found");

    return {
      manual: ManualResponseDto.from(manual),
      company: {
        id: company.id,
        name: company.name,
        officialMark: company.officialMark,
        homePage: company.homePage ?? null,
      },
      pdfs: pdfList.map(ManualPdfResponseDto.from),
      parts: partList.map(PartResponseDto.from),
      faqs: faqList.map(FaqResponseDto.from),
      customerService: cs ? CustomerServiceResponseDto.from(cs) : null,
    };
  }
}
