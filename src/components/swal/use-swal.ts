import defu from "defu";
import { useSingleton } from "../../composables/use-singleton";

interface SwalOptions {
  title?: string;
  text?: string;
  type?: string;
  isConfirm?: boolean;
  confirm?: Record<string, unknown>; // Ganti dengan tipe yang sesuai jika ada
  cancel?: Record<string, unknown>; // Ganti dengan tipe yang sesuai jika ada
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const swal = async (options: SwalOptions = {}): Promise<any> => {
  const SwalRootModule = await import("./swal-root.vue");
  const SwalRoot = SwalRootModule.default;

  const SwalInstance = await useSingleton(SwalRoot);

  const result = await new Promise((resolve) => {
    SwalInstance.show(
      defu(
        {
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        },
        options,
        {
          title: "",
          text: "",
          type: "info",
          isConfirm: false,
          confirm: {},
          cancel: {},
        },
      ),
    );
  });
  return result;
};
