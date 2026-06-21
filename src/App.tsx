import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useScanStore } from "./store/scanStore";
import { useSystemStats } from "./hooks/useSystemStats";
import { useScan } from "./hooks/useScan";
import SplashScreen from "./components/Splash/SplashScreen";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import StatusBar from "./components/Layout/StatusBar";
import AIAssistant from "./components/AI/AIAssistant";
import Dashboard from "./components/Dashboard/Dashboard";
import PipelineView from "./components/Pipeline/PipelineView";
import ResultsTabs from "./components/Results/ResultsTabs";
import AIChat from "./components/AI/AIChat";
import ReportPreview from "./components/Report/ReportPreview";
import GraphView from "./components/Graph/GraphView";

function MainApp() {
  useSystemStats();
  useScan();
  const view = useScanStore((s) => s.view);

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto p-6">
          {view === "dashboard" && <Dashboard />}
          {view === "scan" && <PipelineView />}
          {view === "results" && <ResultsTabs />}
          {view === "graph" && <GraphView />}
          {view === "ai" && <AIChat />}
          {view === "report" && <ReportPreview />}
        </main>
        <AIAssistant />
      </div>
      <StatusBar />
    </div>
  );
}

/**
 * Re-scan app — alohida Tauri window'da ishlaydigan nusxa.
 * URL param orqali target olinadi va avtomatik skan boshlanadi.
 */
export function RescanApp({ target }: { target: string }) {
  useSystemStats();
  const setDomain = useScanStore((s) => s.setDomain);
  const setScanning = useScanStore((s) => s.setScanning);
  const setView = useScanStore((s) => s.setView);
  const view = useScanStore((s) => s.view);

  useScan();

  // Target'ni store'ga o'rnatamiz va avtomatik skan boshlaymiz.
  useEffect(() => {
    setDomain(target);
    setView("scan");
    setScanning(true);
    invoke("start_scan", { domain: target }).catch((e: unknown) => {
      console.error("rescan start_scan error:", e);
      setScanning(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-auto p-6">
          {view === "dashboard" && <Dashboard />}
          {view === "scan" && <PipelineView />}
          {view === "results" && <ResultsTabs />}
          {view === "graph" && <GraphView />}
          {view === "ai" && <AIChat />}
          {view === "report" && <ReportPreview />}
        </main>
        <AIAssistant />
      </div>
      <StatusBar />
    </div>
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);
  const onSplashDone = useCallback(() => setSplash(false), []);

  if (splash) {
    return <SplashScreen onDone={onSplashDone} />;
  }

  return <MainApp />;
}
