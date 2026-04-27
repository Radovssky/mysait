"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  value: string | null;
  onChange: (path: string | null) => void;
  label?: string;
  description?: string;
  aspect?: "video" | "square" | "portrait";
};

const aspectClass: Record<NonNullable<Props["aspect"]>, string> = {
  video: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

export function ImageUploader({
  value,
  onChange,
  label,
  description,
  aspect = "video",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(data.error ?? "upload failed");
      }
      const data = (await response.json()) as { path: string };
      onChange(data.path);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "upload failed",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
      )}
      {value ? (
        <div
          className={`relative ${aspectClass[aspect]} overflow-hidden rounded-lg border border-border bg-card`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="font-mono"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "..." : "заменить"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="font-mono"
              onClick={() => onChange(null)}
              disabled={uploading}
            >
              убрать
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full ${aspectClass[aspect]} cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-card font-mono text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground`}
          disabled={uploading}
        >
          {uploading ? "загрузка..." : "+ выбрать файл (jpg, png, webp · до 5 МБ)"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {description && (
        <p className="font-mono text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p role="alert" className="font-mono text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
