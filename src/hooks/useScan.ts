import { useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import {
  useScanStore,
  type PipelineEvent,
  type ScanContext,
  type GraphData,
  type StageResult,
} from "../store/scanStore";

export function useScan() {
  const domain = useScanStore((s) => s.domain);
  const scanning = useScanStore((s) => s.scanning);
  const setScanning = useScanStore((s) => s.setScanning);
  const applyEvent = useScanStore((s) => s.applyEvent);
  const applyStageResult = useScanStore((s) => s.applyStageResult);
  const mergeGraph = useScanStore((s) => s.mergeGraph);
  const setContext = useScanStore((s) => s.setContext);
  const setGraphData = useScanStore((s) => s.setGraphData);
  const reset = useScanStore((s) => s.reset);
  const setView = useScanStore((s) => s.setView);
  const tickElapsed = useScanStore((s) => s.tickElapsed);

  // Wire pipeline events + progressive results + graph into the store.
  useEffect(() => {
    let active = true;
    let unsubEvent: UnlistenFn | undefined;
    let unsubDone: UnlistenFn | undefined;
    let unsubGraph: UnlistenFn | undefined;
    let unsubGraphPartial: UnlistenFn | undefined;
    let unsubStageResults: UnlistenFn | undefined;

    (async () => {
      unsubEvent = await listen<PipelineEvent>("pipeline-event", (e) => {
        if (active) applyEvent(e.payload);
      });
      unsubDone = await listen<ScanContext>("scan-complete", (e) => {
        if (active) {
          setContext(e.payload);
          setScanning(false);
          setView("graph");
        }
      });
      // Yakuniy to'liq graph — to'liq o'rnatamiz.
      unsubGraph = await listen<GraphData>("graph-ready", (e) => {
        if (active) setGraphData(e.payload);
      });
      // Live partial graph — har bosqichdan keyin merge qilamiz.
      unsubGraphPartial = await listen<GraphData>("graph-partial", (e) => {
        if (active) mergeGraph(e.payload);
      });
      // Progressive results — har bosqichdan keyin context'ni yangilaymiz.
      unsubStageResults = await listen<StageResult>("stage-results", (e) => {
        if (active) applyStageResult(e.payload);
      });
      // If component already unmounted, clean up immediately
      if (!active) {
        unsubEvent();
        unsubDone();
        unsubGraph?.();
        unsubGraphPartial?.();
        unsubStageResults?.();
      }
    })();

    return () => {
      active = false;
      unsubEvent?.();
      unsubDone?.();
      unsubGraph?.();
      unsubGraphPartial?.();
      unsubStageResults?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Elapsed clock runs while a scan is active.
  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => tickElapsed(), 1000);
    return () => clearInterval(id);
  }, [scanning, tickElapsed]);

  const start = useCallback(
    async (target?: string) => {
      const d = (target ?? domain).trim();
      if (!d) return;
      reset();
      useScanStore.getState().setDomain(d);
      setScanning(true);
      setView("scan");
      try {
        await invoke("start_scan", { domain: d });
      } catch (e) {
        setScanning(false);
        console.error(e);
      }
    },
    [domain, reset, setScanning, setView]
  );

  const stop = useCallback(async () => {
    try {
      await invoke("stop_scan");
    } catch (e) {
      console.error("Failed to stop scan:", e);
    } finally {
      setScanning(false);
    }
  }, [setScanning]);

  return { start, stop, scanning };
}
