import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useScanStore } from "../store/scanStore";

export function useSystemStats() {
  const setStats = useScanStore((s) => s.setStats);
  const scanning = useScanStore((s) => s.scanning);

  // Always keep stats fresh while scanning
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const stats = await invoke<{
          cpu_usage: number;
          ram_used_mb: number;
          ram_total_mb: number;
          thread_count: number;
        }>("get_system_stats");
        if (active) setStats(stats);
      } catch {
        // Backend may not be ready during early render — ignore.
      }
    };
    poll();
    const id = setInterval(poll, 1500);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [setStats, scanning]);
}
