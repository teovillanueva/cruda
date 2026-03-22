"use client";

import * as Dialog from "@radix-ui/react-dialog";

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "cancelar",
  onConfirm,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/20 dark:bg-black/40 backdrop-blur-sm data-[state=open]:animate-[modal-overlay-in_200ms_ease-out] data-[state=closed]:animate-[modal-overlay-out_150ms_ease-in]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl px-8 py-7 shadow-xl shadow-black/[0.06] max-w-xs w-[calc(100%-2rem)] data-[state=open]:animate-[modal-content-in_200ms_ease-out] data-[state=closed]:animate-[modal-content-out_150ms_ease-in]">
          <Dialog.Title className="text-base font-serif font-light">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="mt-2 text-sm text-muted leading-relaxed">
              {description}
            </Dialog.Description>
          )}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {loading ? "eliminando..." : confirmLabel}
            </button>
            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
