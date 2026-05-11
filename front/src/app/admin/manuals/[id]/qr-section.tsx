"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  manualId: number;
  manualName: string;
}

// QR 코드는 클라이언트에서만 — 백엔드 라운드트립 X.
// URL은 window.location.origin 으로 자동 (dev/prod 둘 다 정확).
export function QrSection({ manualId, manualName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = `${window.location.origin}/p/${manualId}`;
    setUrl(target);

    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, target, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "M",
    }).catch((err: Error) => setError(err.message));
  }, [manualId]);

  async function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(blob, `qr-${slug(manualName)}-${manualId}.png`);
    }, "image/png");
  }

  async function downloadSvg() {
    if (!url) return;
    try {
      const svg = await QRCode.toString(url, {
        type: "svg",
        width: 1024, // 인쇄용 큰 사이즈
        margin: 2,
        errorCorrectionLevel: "M",
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      triggerDownload(blob, `qr-${slug(manualName)}-${manualId}.svg`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function copyUrl() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className="space-y-3 rounded-md border p-4">
      <h2 className="text-xl font-semibold">QR 코드</h2>
      <p className="text-sm text-(--color-muted-foreground)">
        스캔 시 공개 매뉴얼 페이지로 이동합니다. PNG는 화면용·SVG는 인쇄·라벨용.
      </p>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <canvas ref={canvasRef} className="rounded-md border bg-white" />

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 rounded-(--radius) border bg-(--color-muted) px-3 py-2 text-xs"
            />
            <Button variant="secondary" onClick={copyUrl}>
              {copied ? "복사됨" : "복사"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadPng}>PNG 다운로드</Button>
            <Button variant="secondary" onClick={downloadSvg}>
              SVG 다운로드
            </Button>
          </div>
          {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

function triggerDownload(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 32) || "manual";
}
