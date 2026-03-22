"use client";

import { useState } from "react";

export function PhotoEditForm({
  initialTitle,
  initialDescription,
  onSave,
  onSkip,
  saving,
}: {
  initialTitle: string | null;
  initialDescription: string | null;
  onSave: (title: string | null, description: string | null) => void;
  onSkip?: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title.trim() || null, description.trim() || null);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="titulo (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors"
      />
      <textarea
        placeholder="descripcion (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full bg-transparent border-b border-border py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:border-foreground transition-colors resize-none"
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          {saving ? "guardando..." : "guardar"}
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            saltar
          </button>
        )}
      </div>
    </form>
  );
}
