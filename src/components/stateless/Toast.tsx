import { Toaster } from "sonner";

export default function ToastMessage() {
  return (
    <Toaster
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!p-3 !-my-1",
        },
      }}
    />
  );
}
