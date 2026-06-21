import { create } from "zustand";

export type StageStatus = "pending" | "running" | "done" | "error" | "skipped";

export interface PipelineEvent {
  stage: string;
  status: StageStatus;
  message: string;
  count: number;
  progress: number;
}

export interface HttpResult {
  url: string;
  status: number;
  title: string;
  server: string | null;
  response_time_ms: number;
  redirect_chain: string[];
  content_length: number | null;
}

export interface Technology {
  name: string;
  version: string | null;
  category: string;
  confidence: number;
}

export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";

export interface HeaderIssue {
  url: string;
  issue: string;
  severity: Severity;
  header: string;
  recommendation: string;
}

export interface Secret {
  secret_type: string;
  preview: string;
  location: string;
  severity: Severity;
}

export interface CveMatch {
  cve_id: string;
  description: string;
  cvss_score: number;
  severity: Severity;
  affected_tech: string;
  affected_urls: string[];
  published: string;
}

export interface ScanSummary {
  total_subdomains: number;
  alive_hosts: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  secrets_found: number;
  elapsed_secs: number;
}

// ── Parasite operatsiyalari natija turlari ─────────────────────────────────

export interface BackdoorResult {
  path: string;
  description: string;
  severity: string;
  status_code: number;
  url: string;
}

export interface DirectoryResult {
  path: string;
  status_code: number;
  url: string;
}

export interface CorsResult {
  origin: string;
  allow_origin: string;
  allow_credentials: boolean;
  vulnerable: boolean;
}

export interface HttpMethodResult {
  method: string;
  status_code: number;
  dangerous: boolean;
}

export interface SslResult {
  url: string;
  https_active: boolean;
  http_to_https_redirect: boolean;
  hsts: boolean;
  hsts_value: string | null;
  has_csp: boolean;
  has_x_frame_options: boolean;
  has_x_content_type_options: boolean;
  has_referrer_policy: boolean;
}

export interface OpenRedirectResult {
  parameter: string;
  payload_type: string;
  payload: string;
  redirect_location: string | null;
  vulnerable: boolean;
}

export interface ApiEndpointResult {
  method: string;
  path: string;
  params: string[];
  found_in: string;
}

export interface FormFieldResult {
  name: string;
  field_type: string;
  has_password: boolean;
}

export interface FormResult {
  action: string;
  form_method: string;
  form_type: string;
  fields: FormFieldResult[];
}

export interface BrokenLinkResult {
  domain: string;
  status: string;
  pages: string[];
}

export interface HeaderDumpResult {
  url: string;
  headers: [string, string][];
  security_headers: string[];
}

export interface CrawlResult {
  url: string;
  title: string;
  status_code: number;
  content_type: string;
  depth: number;
}

export interface ResourceResult {
  url: string;
  resource_type: string;
  size: number | null;
}

export interface WsResult {
  url: string;
  reachable: boolean;
}

export interface AnalyzeResult {
  url: string;
  status: number;
  title: string;
  server: string | null;
  tech: string[];
  links_count: number;
  has_csp: boolean;
  has_hsts: boolean;
  score: number;
}

export interface SecurityFinding {
  header: string;
  present: boolean;
  value: string | null;
  points: number;
}

export interface SecurityProbeResult {
  url: string;
  grade: string;
  score: number;
  findings: SecurityFinding[];
}

// ── Graph turlari ───────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  node_type: string;
  color: string;
  detail: string | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── StageResult — progressive context update ───────────────────────────────

export interface StageResult {
  stage: string;
  subdomains?: string[];
  ips?: Record<string, string[]>;
  http_results?: HttpResult[];
  technologies?: Technology[];
  headers_analysis?: HeaderIssue[];
  secrets?: Secret[];
  cves?: CveMatch[];
  backdoors?: BackdoorResult[];
  directories?: DirectoryResult[];
  cors_results?: CorsResult[];
  http_methods?: HttpMethodResult[];
  ssl_results?: SslResult[];
  header_dumps?: HeaderDumpResult[];
  open_redirects?: OpenRedirectResult[];
  api_endpoints?: ApiEndpointResult[];
  forms?: FormResult[];
  broken_links?: BrokenLinkResult[];
  crawl_results?: CrawlResult[];
  resources?: ResourceResult[];
  ws_results?: WsResult[];
  analyze_results?: AnalyzeResult[];
  security_probes?: SecurityProbeResult[];
}

export interface ScanContext {
  domain: string;
  subdomains: string[];
  ips: Record<string, string[]>;
  http_results: HttpResult[];
  technologies: Technology[];
  headers_analysis: HeaderIssue[];
  secrets: Secret[];
  cves: CveMatch[];
  summary: ScanSummary;

  // Parasite operatsiyalari
  backdoors: BackdoorResult[];
  directories: DirectoryResult[];
  cors_results: CorsResult[];
  http_methods: HttpMethodResult[];
  ssl_results: SslResult[];
  header_dumps: HeaderDumpResult[];
  open_redirects: OpenRedirectResult[];
  api_endpoints: ApiEndpointResult[];
  forms: FormResult[];
  broken_links: BrokenLinkResult[];
  crawl_results: CrawlResult[];
  resources: ResourceResult[];
  ws_results: WsResult[];
  analyze_results: AnalyzeResult[];
  security_probes: SecurityProbeResult[];
}

export interface SystemStats {
  cpu_usage: number;
  ram_used_mb: number;
  ram_total_mb: number;
  thread_count: number;
}

export type View = "dashboard" | "scan" | "results" | "graph" | "ai" | "report";

interface ScanStore {
  view: View;
  setView: (v: View) => void;

  domain: string;
  setDomain: (d: string) => void;

  scanning: boolean;
  setScanning: (b: boolean) => void;

  events: PipelineEvent[];
  liveLog: string[];
  stages: Record<string, StageStatus>;
  lastProgress: number;

  context: ScanContext | null;
  graphData: GraphData | null;
  stats: SystemStats | null;
  elapsedSecs: number;

  applyEvent: (ev: PipelineEvent) => void;
  applyStageResult: (sr: StageResult) => void;
  mergeGraph: (g: GraphData) => void;
  setContext: (c: ScanContext) => void;
  setGraphData: (g: GraphData) => void;
  setStats: (s: SystemStats) => void;
  reset: () => void;
  tickElapsed: () => void;
}

// 24 ta bosqich — Rust STAGES bilan AYNAN bir xil nomlar.
const emptyStages = (): Record<string, StageStatus> => ({
  "Subdomain Discovery": "pending",
  "DNS Resolver": "pending",
  "HTTP Probe": "pending",
  "Fingerprint": "pending",
  "Headers Analysis": "pending",
  "Secrets Scanner": "pending",
  "CVE Match": "pending",
  "Backdoor Hunter": "pending",
  "CORS Probe": "pending",
  "Directory Brute": "pending",
  "HTTP Methods": "pending",
  "SSL Inspector": "pending",
  "Header Dump": "pending",
  "Open Redirect": "pending",
  "API Discovery": "pending",
  "API Brute Force": "pending",
  "Form Analysis": "pending",
  "Broken Links": "pending",
  "Stealth Crawl": "pending",
  "Resource Enum": "pending",
  "WS Scanner": "pending",
  "Host Analyze": "pending",
  "Security Probe": "pending",
  "Final Report": "pending",
});

export const useScanStore = create<ScanStore>((set) => ({
  view: "dashboard",
  setView: (v) => set({ view: v }),

  domain: "",
  setDomain: (d) => set({ domain: d }),

  scanning: false,
  setScanning: (b) => set({ scanning: b }),

  events: [],
  liveLog: [],
  stages: emptyStages(),
  lastProgress: 0,

  context: null,
  graphData: null,
  stats: null,
  elapsedSecs: 0,

  applyEvent: (ev) =>
    set((state) => {
      const stages = { ...state.stages, [ev.stage]: ev.status };
      const liveLog = [...state.liveLog, `${formatLogLine(ev)}`].slice(-500);
      const events = [...state.events, ev].slice(-500);
      const lastProgress = Math.max(state.lastProgress, ev.progress);
      return { stages, liveLog, events, lastProgress };
    }),

  // Progressive context — har kelgan stage-result'da o'sha maydonni yangilaymiz.
  applyStageResult: (sr) =>
    set((state) => {
      const base: ScanContext = state.context ?? emptyContext();
      const next: ScanContext = {
        ...base,
        subdomains: sr.subdomains ?? base.subdomains,
        ips: sr.ips ?? base.ips,
        http_results: sr.http_results ?? base.http_results,
        technologies: sr.technologies ?? base.technologies,
        headers_analysis: sr.headers_analysis ?? base.headers_analysis,
        secrets: sr.secrets ?? base.secrets,
        cves: sr.cves ?? base.cves,
        backdoors: sr.backdoors ?? base.backdoors,
        directories: sr.directories ?? base.directories,
        cors_results: sr.cors_results ?? base.cors_results,
        http_methods: sr.http_methods ?? base.http_methods,
        ssl_results: sr.ssl_results ?? base.ssl_results,
        header_dumps: sr.header_dumps ?? base.header_dumps,
        open_redirects: sr.open_redirects ?? base.open_redirects,
        api_endpoints: sr.api_endpoints ?? base.api_endpoints,
        forms: sr.forms ?? base.forms,
        broken_links: sr.broken_links ?? base.broken_links,
        crawl_results: sr.crawl_results ?? base.crawl_results,
        resources: sr.resources ?? base.resources,
        ws_results: sr.ws_results ?? base.ws_results,
        analyze_results: sr.analyze_results ?? base.analyze_results,
        security_probes: sr.security_probes ?? base.security_probes,
      };
      return { context: next };
    }),

  // Partial graph merge — yangi node'lar qo'shamiz, takrorlarini olib tashlaymiz.
  mergeGraph: (g) =>
    set((state) => {
      const prev = state.graphData;
      if (!prev) return { graphData: g };
      const seen = new Set(prev.nodes.map((n) => n.id));
      const newNodes = g.nodes.filter((n) => !seen.has(n.id));
      const seenEdges = new Set(prev.edges.map((e) => `${e.source}|${e.target}|${e.label}`));
      const newEdges = g.edges.filter((e) => !seenEdges.has(`${e.source}|${e.target}|${e.label}`));
      return {
        graphData: {
          nodes: [...prev.nodes, ...newNodes],
          edges: [...prev.edges, ...newEdges],
        },
      };
    }),

  setContext: (c) => set({ context: c, elapsedSecs: c.summary.elapsed_secs }),
  setGraphData: (g) => set({ graphData: g }),
  setStats: (s) => set({ stats: s }),

  reset: () =>
    set({
      events: [],
      liveLog: [],
      stages: emptyStages(),
      lastProgress: 0,
      context: null,
      graphData: null,
      stats: null,
      elapsedSecs: 0,
    }),

  tickElapsed: () => set((s) => ({ elapsedSecs: s.elapsedSecs + 1 })),
}));

function formatLogLine(ev: PipelineEvent): string {
  const time = new Date().toLocaleTimeString();
  return `[${time}] ${ev.status.toUpperCase().padEnd(7)} ${ev.stage}: ${ev.message}`;
}

// Progressive context uchun bo'sh ScanContext (applyStageResult'da ishlatiladi).
function emptyContext(): ScanContext {
  return {
    domain: "",
    subdomains: [],
    ips: {},
    http_results: [],
    technologies: [],
    headers_analysis: [],
    secrets: [],
    cves: [],
    summary: {
      total_subdomains: 0,
      alive_hosts: 0,
      critical_count: 0,
      high_count: 0,
      medium_count: 0,
      low_count: 0,
      secrets_found: 0,
      elapsed_secs: 0,
    },
    backdoors: [],
    directories: [],
    cors_results: [],
    http_methods: [],
    ssl_results: [],
    header_dumps: [],
    open_redirects: [],
    api_endpoints: [],
    forms: [],
    broken_links: [],
    crawl_results: [],
    resources: [],
    ws_results: [],
    analyze_results: [],
    security_probes: [],
  };
}
