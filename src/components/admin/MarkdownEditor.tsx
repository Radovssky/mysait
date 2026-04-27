"use client";

import "@uiw/react-md-editor/markdown-editor.css";

import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] rounded-md border border-dashed border-border bg-card font-mono text-sm text-muted-foreground flex items-center justify-center">
        загрузка редактора…
      </div>
    ),
  },
);

type Props = {
  value: string;
  onChange: (next: string) => void;
  height?: number;
};

export function MarkdownEditor({ value, onChange, height = 320 }: Props) {
  return (
    <div data-color-mode="dark" className="md-editor-shell">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? "")}
        height={height}
        preview="edit"
        visibleDragbar={false}
      />
    </div>
  );
}
