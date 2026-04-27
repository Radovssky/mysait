"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";

import type { ProjectFormState } from "@/app/admin/(private)/projects/_actions";
import type { Project } from "@db/schema";

import { ImageUploader } from "./ImageUploader";

type Action = (
  state: ProjectFormState,
  formData: FormData,
) => Promise<ProjectFormState>;

type Props = {
  action: Action;
  initial?: Partial<Project>;
  submitLabel: string;
  successMessage?: string;
};

const categories: Array<{ value: string; label: string }> = [
  { value: "chatbot", label: "чат-бот" },
  { value: "ai_agent", label: "AI-агент" },
  { value: "voice", label: "голосовой агент" },
  { value: "content", label: "контент-агент" },
  { value: "custom", label: "кастомное решение" },
];

function toDatetimeLocal(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ProjectForm({
  action,
  initial,
  submitLabel,
  successMessage,
}: Props) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    action,
    { status: "idle" },
  );

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [stackText, setStackText] = useState(
    (initial?.stack ?? []).join(", "),
  );
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [coverImage, setCoverImage] = useState<string | null>(
    initial?.coverImage ?? null,
  );

  useEffect(() => {
    if (state.status === "ok" && successMessage) {
      toast.success(successMessage);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state, successMessage]);

  const fieldError = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  return (
    <form action={formAction} className="space-y-10">
      <FieldGroup>
        <Field data-invalid={Boolean(fieldError("title"))}>
          <FieldLabel htmlFor="title">Заголовок</FieldLabel>
          <Input
            id="title"
            name="title"
            value={title}
            required
            onChange={(event) => {
              const next = event.target.value;
              setTitle(next);
              if (!slugTouched) setSlug(slugify(next));
            }}
          />
          {fieldError("title") && (
            <FieldError errors={[{ message: fieldError("title") }]} />
          )}
        </Field>

        <Field data-invalid={Boolean(fieldError("slug"))}>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            name="slug"
            value={slug}
            required
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugTouched(true);
            }}
          />
          <FieldDescription>
            Латиница и дефисы. Берётся из заголовка автоматически, можно
            переопределить вручную.
          </FieldDescription>
          {fieldError("slug") && (
            <FieldError errors={[{ message: fieldError("slug") }]} />
          )}
        </Field>

        <Field data-invalid={Boolean(fieldError("shortDescription"))}>
          <FieldLabel htmlFor="shortDescription">Краткое описание</FieldLabel>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            defaultValue={initial?.shortDescription ?? ""}
            rows={3}
            required
            maxLength={500}
          />
          <FieldDescription>
            1–2 предложения для карточки на главной.
          </FieldDescription>
          {fieldError("shortDescription") && (
            <FieldError
              errors={[{ message: fieldError("shortDescription") }]}
            />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Категория</FieldLabel>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "")}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="не выбрано" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="category" value={category ?? ""} />
        </Field>

        <Field>
          <FieldLabel>Обложка</FieldLabel>
          <ImageUploader
            value={coverImage}
            onChange={setCoverImage}
            description="Главное изображение кейса. Показывается на карточке главной и в шапке /projects/[slug]."
          />
          <input
            type="hidden"
            name="coverImage"
            value={coverImage ?? ""}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="client">Клиент / индустрия</FieldLabel>
          <Input id="client" name="client" defaultValue={initial?.client ?? ""} />
        </Field>

        <Field>
          <FieldLabel htmlFor="context">Контекст / задача</FieldLabel>
          <Textarea
            id="context"
            name="context"
            defaultValue={initial?.context ?? ""}
            rows={6}
          />
          <FieldDescription>
            Markdown поддерживается на странице проекта (рендер появится
            на шаге 9 плана).
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="solution">Решение</FieldLabel>
          <Textarea
            id="solution"
            name="solution"
            defaultValue={initial?.solution ?? ""}
            rows={8}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="stack">Стек / интеграции</FieldLabel>
          <Input
            id="stack"
            name="stack"
            value={stackText}
            placeholder="n8n, OpenAI, amoCRM"
            onChange={(event) => setStackText(event.target.value)}
          />
          <FieldDescription>
            Через запятую. Каждая позиция станет бейджем на странице проекта.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="result">Результат / метрики</FieldLabel>
          <Textarea
            id="result"
            name="result"
            defaultValue={initial?.result ?? ""}
            rows={5}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="sortOrder">Порядок</FieldLabel>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={String(initial?.sortOrder ?? 0)}
            />
            <FieldDescription>Больше = выше в гриде.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="publishedAt">Дата публикации</FieldLabel>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(initial?.publishedAt)}
            />
            <FieldDescription>
              Можно оставить пустым — выставится автоматически при публикации.
            </FieldDescription>
          </Field>
        </div>

        <Field>
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div>
              <FieldLabel htmlFor="isPublished" className="cursor-pointer">
                Опубликован
              </FieldLabel>
              <FieldDescription>
                Только опубликованные кейсы видны на главной и через прямой URL.
              </FieldDescription>
            </div>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <input
              type="hidden"
              name="isPublished"
              value={isPublished ? "on" : ""}
            />
          </div>
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} className="font-mono">
          {pending ? "..." : `> ${submitLabel}`}
        </Button>
      </div>
    </form>
  );
}
