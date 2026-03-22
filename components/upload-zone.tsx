"use client";

import { useState, useRef, useCallback } from "react";

export function UploadZone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList).filter((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      );
      if (files.length > 0) onFiles(files);
    },
    [onFiles],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-[60vh] flex flex-col items-center justify-center border-2 border-dashed rounded-sm transition-colors cursor-pointer ${
        dragging
          ? "border-foreground/40 bg-foreground/[0.02]"
          : "border-foreground/10 hover:border-foreground/25"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <p className="text-sm text-foreground/40 italic mb-4">
        arrastra tus fotos aqui
      </p>
      <p className="text-sm text-muted">
        o hace click para seleccionar
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
