import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import nodemailer, { type Transporter } from "nodemailer";

import { REDIS } from "@/common/redis/redis.module";

const ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;
  private readonly devStub: boolean;

  // 옛 Spring 키 호환: EmailCodeCache::{email}, PwChangeCodeCache::{email}
  static readonly EMAIL_CODE_KEY = (email: string) => `EmailCodeCache::${email}`;
  static readonly PW_CODE_KEY = (email: string) => `PwChangeCodeCache::${email}`;

  static readonly EMAIL_CODE_TTL_SEC = 3 * 60; // 3분
  static readonly PW_CODE_TTL_SEC = 5 * 60; // 5분

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {
    // ConfigService.get은 빈 문자열을 그대로 반환하므로 ?? 대신 || 로 빈 값까지 fallback.
    const user =
      config.get<string>("MAIL_USER") || config.get<string>("GOOGLE_EMAIL") || undefined;
    const pass =
      config.get<string>("MAIL_PASSWORD") || config.get<string>("GOOGLE_PASSWORD") || undefined;

    // 메일 자격증명 미설정 + dev 환경 → 콘솔 스텁. 운영(NODE_ENV=production)에서는 강제로 실제 발송 시도.
    this.devStub = !user || !pass;
    if (this.devStub && config.get("NODE_ENV") === "production") {
      throw new Error("MAIL_USER / MAIL_PASSWORD must be set in production");
    }

    this.transporter = this.devStub
      ? null
      : nodemailer.createTransport({
          host: config.get("MAIL_HOST") ?? "smtp.gmail.com",
          port: Number(config.get("MAIL_PORT") ?? 587),
          secure: false,
          requireTLS: true,
          auth: { user: user!, pass: pass! },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000,
        });
    this.from = config.get<string>("MAIL_FROM") || user || "no-reply@qrmanual.local";

    if (this.devStub) {
      this.logger.warn(
        "MAIL_USER/MAIL_PASSWORD 미설정 — 인증 코드를 콘솔에 출력하는 dev 스텁으로 동작합니다",
      );
    }
  }

  generateCode(length = 8): string {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
    }
    return code;
  }

  async sendVerificationCode(email: string): Promise<string> {
    const code = this.generateCode();
    await this.redis.set(MailService.EMAIL_CODE_KEY(email), code, "EX", MailService.EMAIL_CODE_TTL_SEC);

    if (this.devStub || !this.transporter) {
      this.logger.warn(`[DEV STUB] verification code for ${email}: ${code}`);
      return code;
    }

    const html = [
      "<h3>QRManual 에서 요청하신 인증 번호 입니다.</h3>",
      `<h1>${code}</h1>`,
      "<h3>감사합니다.</h3>",
    ].join("");

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: email,
        subject: "이메일 인증",
        html,
      });
    } catch (err) {
      this.logger.error(`mail send failed: ${(err as Error).message}`);
      throw new Error("메일 발송 중 오류가 발생했습니다.");
    }
    return code;
  }

  async getEmailCode(email: string): Promise<string | null> {
    return this.redis.get(MailService.EMAIL_CODE_KEY(email));
  }

  async sendInvitation(opts: {
    to: string;
    companyName: string;
    role: string;
    acceptUrl: string;
    inviterName?: string;
  }): Promise<void> {
    if (this.devStub || !this.transporter) {
      this.logger.warn(
        `[DEV STUB] invitation to ${opts.to} (role=${opts.role}, company=${opts.companyName}): ${opts.acceptUrl}`,
      );
      return;
    }

    const html = [
      `<h3>${opts.companyName} 으로의 초대</h3>`,
      `<p>${opts.inviterName ?? "관리자"} 님이 ${opts.companyName} 의 ${opts.role} 역할로 초대했습니다.</p>`,
      `<p><a href="${opts.acceptUrl}">초대 수락하기</a></p>`,
      "<p>이 링크는 발급 후 7일간 유효합니다.</p>",
    ].join("");

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: opts.to,
        subject: `${opts.companyName} 초대`,
        html,
      });
    } catch (err) {
      this.logger.error(`invitation mail send failed: ${(err as Error).message}`);
      throw new Error("초대 메일 발송 중 오류가 발생했습니다.");
    }
  }

  async issuePasswordResetCode(email: string): Promise<string> {
    const code = this.generateCode();
    await this.redis.set(MailService.PW_CODE_KEY(email), code, "EX", MailService.PW_CODE_TTL_SEC);
    return code;
  }

  async getPasswordResetCode(email: string): Promise<string | null> {
    return this.redis.get(MailService.PW_CODE_KEY(email));
  }

  async clearEmailCode(email: string): Promise<void> {
    await this.redis.del(MailService.EMAIL_CODE_KEY(email));
  }

  async clearPasswordResetCode(email: string): Promise<void> {
    await this.redis.del(MailService.PW_CODE_KEY(email));
  }
}
