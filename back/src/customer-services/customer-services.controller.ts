import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import {
  CustomerServiceResponseDto,
  UpsertCustomerServiceDto,
} from "./dto/customer-service.dto";
import { CustomerServicesService } from "./customer-services.service";

@ApiTags("customer-services")
@Controller("api/manuals/:manualId/customer-service")
export class CustomerServicesController {
  constructor(private readonly cs: CustomerServicesService) {}

  @Get()
  @ApiOperation({ summary: "매뉴얼 고객센터 정보 (없으면 null)" })
  async get(
    @Param("manualId", ParseIntPipe) manualId: number,
  ): Promise<CustomerServiceResponseDto | null> {
    const item = await this.cs.findByManual(manualId);
    return item ? CustomerServiceResponseDto.from(item) : null;
  }

  @Put()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "고객센터 정보 등록·수정 (upsert)" })
  async upsert(
    @CurrentUser() user: User,
    @Param("manualId", ParseIntPipe) manualId: number,
    @Body() dto: UpsertCustomerServiceDto,
  ): Promise<CustomerServiceResponseDto> {
    const saved = await this.cs.upsert(user, manualId, dto);
    return CustomerServiceResponseDto.from(saved);
  }

  @Delete()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "고객센터 정보 삭제" })
  async remove(
    @CurrentUser() user: User,
    @Param("manualId", ParseIntPipe) manualId: number,
  ): Promise<void> {
    await this.cs.remove(user, manualId);
  }
}
