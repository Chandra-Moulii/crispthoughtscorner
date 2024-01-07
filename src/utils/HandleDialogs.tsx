import { RefObject } from "react";

export function openDialog(ref: paramType) {
  ref.current?.showModal();
  ref.current?.setAttribute("data-state", "open");
}

export function closeDialog(ref: paramType) {
  ref.current?.close();
  ref.current?.setAttribute("data-state", "closed");
}

type paramType = RefObject<HTMLDialogElement>;
