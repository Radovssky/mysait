"use client";

import { Button } from "@/components/ui/button";

import { deleteProjectAction } from "@/app/admin/(private)/projects/_actions";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteProjectAction.bind(null, id)}
      onSubmit={(event) => {
        if (
          !window.confirm(`Удалить кейс «${title}»? Действие необратимо.`)
        ) {
          event.preventDefault();
        }
      }}
    >
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        className="font-mono"
      >
        удалить
      </Button>
    </form>
  );
}
