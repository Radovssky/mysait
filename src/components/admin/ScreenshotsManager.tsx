"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  addScreenshotAction,
  deleteScreenshotAction,
  updateScreenshotAction,
} from "@/app/admin/(private)/projects/_screenshots-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ProjectScreenshot } from "@db/schema";

type Props = {
  projectId: string;
  screenshots: ProjectScreenshot[];
};

export function ScreenshotsManager({ projectId, screenshots }: Props) {
  return (
    <div className="space-y-6">
      <AddForm projectId={projectId} />
      {screenshots.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">{"// "}</span>
          скриншотов пока нет.
        </p>
      ) : (
        <ul className="space-y-4">
          {screenshots.map((shot) => (
            <ScreenshotRow key={shot.id} shot={shot} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AddForm({ projectId }: { projectId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await addScreenshotAction(projectId, formData);
        formRef.current?.reset();
        toast.success("Скриншот добавлен");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "ошибка");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-border bg-card/40 p-4"
    >
      <p className="font-mono text-xs text-muted-foreground">
        <span className="text-primary">{"// "}</span>добавить скриншот
      </p>
      <Input
        type="file"
        name="file"
        required
        accept="image/jpeg,image/png,image/webp"
      />
      <Input name="caption" placeholder="подпись (опционально)" />
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="sm"
          className="font-mono"
          disabled={pending}
        >
          {pending ? "..." : "+ загрузить"}
        </Button>
        {error && (
          <span className="font-mono text-xs text-destructive">{error}</span>
        )}
      </div>
    </form>
  );
}

function ScreenshotRow({ shot }: { shot: ProjectScreenshot }) {
  const [pendingUpdate, startUpdate] = useTransition();
  const [pendingDelete, startDelete] = useTransition();

  function onUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startUpdate(async () => {
      try {
        await updateScreenshotAction(shot.id, formData);
        toast.success("Сохранено");
      } catch (caught) {
        toast.error(
          caught instanceof Error ? caught.message : "ошибка",
        );
      }
    });
  }

  function onDelete() {
    if (!window.confirm("Удалить скриншот?")) return;
    startDelete(async () => {
      try {
        await deleteScreenshotAction(shot.id);
        toast.success("Удалено");
      } catch (caught) {
        toast.error(
          caught instanceof Error ? caught.message : "ошибка",
        );
      }
    });
  }

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border sm:w-48 sm:flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.imagePath}
          alt={shot.caption ?? ""}
          className="h-full w-full object-cover"
        />
      </div>
      <form
        onSubmit={onUpdate}
        className="flex-1 space-y-3 font-mono text-xs text-muted-foreground"
      >
        <div className="space-y-1">
          <label htmlFor={`caption-${shot.id}`}>подпись</label>
          <Input
            id={`caption-${shot.id}`}
            name="caption"
            defaultValue={shot.caption ?? ""}
            placeholder="опционально"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`sort-${shot.id}`}>порядок</label>
          <Input
            id={`sort-${shot.id}`}
            name="sortOrder"
            type="number"
            defaultValue={String(shot.sortOrder)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="font-mono"
            disabled={pendingUpdate}
          >
            {pendingUpdate ? "..." : "сохранить"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="font-mono"
            disabled={pendingDelete}
            onClick={onDelete}
          >
            {pendingDelete ? "..." : "удалить"}
          </Button>
        </div>
      </form>
    </li>
  );
}
