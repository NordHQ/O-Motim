import { invoke } from "@tauri-apps/api/core";

/**
 * Re-scan: berilgan target'ni yangi Tauri window'da skan qiladi.
 * Frontend `rescan_item` command'ni chaqiradi — backend yangi window ochadi.
 */
export async function rescanRow(target: string) {
  try {
    await invoke("rescan_item", { target });
  } catch (e) {
    console.error("rescan_item failed:", e);
  }
}
