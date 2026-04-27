"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from "@/app/admin/(private)/projects/_testimonial-actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { Testimonial } from "@db/schema";

import { ImageUploader } from "./ImageUploader";

type Props = {
  projectId: string;
  initial: Testimonial | null;
};

export function TestimonialEditor({ projectId, initial }: Props) {
  const [photoPath, setPhotoPath] = useState<string | null>(
    initial?.photoPath ?? null,
  );
  const [pendingSave, startSave] = useTransition();
  const [pendingDelete, startDelete] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startSave(async () => {
      try {
        await saveTestimonialAction(projectId, formData);
        toast.success("Отзыв сохранён");
      } catch (caught) {
        toast.error(caught instanceof Error ? caught.message : "ошибка");
      }
    });
  }

  function onDelete() {
    if (!window.confirm("Удалить отзыв?")) return;
    startDelete(async () => {
      try {
        await deleteTestimonialAction(projectId);
        setPhotoPath(null);
        toast.success("Удалено");
      } catch (caught) {
        toast.error(caught instanceof Error ? caught.message : "ошибка");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Фото автора</FieldLabel>
          <ImageUploader
            value={photoPath}
            onChange={setPhotoPath}
            aspect="square"
            description="Опционально. Показывается рядом с текстом отзыва."
          />
          <input type="hidden" name="photoPath" value={photoPath ?? ""} />
        </Field>

        <Field>
          <FieldLabel htmlFor="authorName">Имя автора</FieldLabel>
          <Input
            id="authorName"
            name="authorName"
            defaultValue={initial?.authorName ?? ""}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="authorRole">Должность / компания</FieldLabel>
          <Input
            id="authorRole"
            name="authorRole"
            defaultValue={initial?.authorRole ?? ""}
            placeholder="опционально"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="text">Текст отзыва</FieldLabel>
          <Textarea
            id="text"
            name="text"
            defaultValue={initial?.text ?? ""}
            rows={6}
            required
          />
          <FieldDescription>
            Без обрамляющих кавычек — они появятся в вёрстке кейса.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          size="default"
          className="font-mono"
          disabled={pendingSave}
        >
          {pendingSave ? "..." : `> ${initial ? "сохранить" : "добавить"}`}
        </Button>
        {initial && (
          <Button
            type="button"
            variant="destructive"
            className="font-mono"
            disabled={pendingDelete}
            onClick={onDelete}
          >
            {pendingDelete ? "..." : "удалить отзыв"}
          </Button>
        )}
      </div>
    </form>
  );
}
