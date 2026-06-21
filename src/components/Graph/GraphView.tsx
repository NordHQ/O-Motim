import { useRef, useEffect, useState, useCallback } from "react";
import { useScanStore } from "../../store/scanStore";
import { useForceLayout, getNodeScale } from "./useForceLayout";
import NodeDetails from "./NodeDetails";

// MOTIM dark theme ranglari
const BG = "#08080f";
const GRID_COLOR = "#111122";
const EDGE_COLOR = "#2a2a40";
const EDGE_HIGHLIGHT = "#4a4a6a";
const LABEL_COLOR = "#e0e0ee";
const MINIMAP_BG = "#0c0c18";
const MINIMAP_BORDER = "#1f1f30";

const NODE_RADIUS: Record<string, number> = {
  domain: 20,
  subdomain: 10,
  ip: 8,
  tech: 9,
  cve: 11,
  secret: 8,
  backdoor: 9,
  api: 8,
  form: 8,
  url: 7,
};

export default function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const graphData = useScanStore((s) => s.graphData);
  const context = useScanStore((s) => s.context);

  const nodesRef = useForceLayout(graphData);

  // Pan/zoom state
  const camera = useRef({ x: 0, y: 0, zoom: 1 });
  const [selectedNode, setSelectedNode] = useState<import("../../store/scanStore").GraphNode | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodesRef.current.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cam = camera.current;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;
    const gridSize = 50 * cam.zoom;
    const offsetX = (-cam.x * cam.zoom + w / 2) % gridSize;
    const offsetY = (-cam.y * cam.zoom + h / 2) % gridSize;
    for (let x = offsetX; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = offsetY; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const toScreen = (nx: number, ny: number) => ({
      x: (nx - cam.x) * cam.zoom + w / 2,
      y: (ny - cam.y) * cam.zoom + h / 2,
    });

    const nodes = nodesRef.current;
    const edges = graphData?.edges ?? [];

    // Draw edges
    for (const edge of edges) {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (!src || !tgt) continue;
      const s = toScreen(src.x, src.y);
      const t = toScreen(tgt.x, tgt.y);

      // Curved edge
      const mx = (s.x + t.x) / 2;
      const my = (s.y + t.y) / 2;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const offset = Math.min(len * 0.15, 20);
      const cx = mx + (-dy / len) * offset;
      const cy = my + (dx / len) * offset;

      const isHighlight = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
      ctx.strokeStyle = isHighlight ? EDGE_HIGHLIGHT : EDGE_COLOR;
      ctx.lineWidth = isHighlight ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.quadraticCurveTo(cx, cy, t.x, t.y);
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(t.y - cy, t.x - cx);
      const arrowLen = 6;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x - arrowLen * Math.cos(angle - 0.3), t.y - arrowLen * Math.sin(angle - 0.3));
      ctx.lineTo(t.x - arrowLen * Math.cos(angle + 0.3), t.y - arrowLen * Math.sin(angle + 0.3));
      ctx.fill();
    }

    // Draw nodes
    for (const nd of nodes) {
      const scale = getNodeScale(nd);
      if (scale <= 0) continue; // hali paydo bo'lmagan

      const pos = toScreen(nd.x, nd.y);
      const r = (NODE_RADIUS[nd.node_type] ?? 8) * cam.zoom * scale;

      // Glow for selected
      if (selectedNode?.id === nd.id) {
        ctx.shadowColor = nd.color;
        ctx.shadowBlur = 15 * scale;
      }

      // Circle
      ctx.fillStyle = nd.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      // Label — fade in with scale
      if (cam.zoom > 0.5 && scale > 0.5) {
        ctx.globalAlpha = Math.min(1, (scale - 0.5) * 2);
        ctx.fillStyle = LABEL_COLOR;
        ctx.font = `${Math.max(9, 10 * cam.zoom)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillText(nd.label.length > 20 ? nd.label.slice(0, 18) + "…" : nd.label, pos.x, pos.y + r + 12 * cam.zoom);
        ctx.globalAlpha = 1;
      }
    }

    // Minimap
    drawMinimap(minimapRef.current, nodes, cam, w, h);
  }, [graphData, nodesRef, selectedNode]);

  function drawMinimap(
    canvas: HTMLCanvasElement | null,
    nodes: { x: number; y: number }[],
    cam: { x: number; y: number; zoom: number },
    w: number,
    h: number,
  ) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || nodes.length === 0) return;

    const mw = canvas.width;
    const mh = canvas.height;

    // Bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of nodes) {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }
    const pad = 50;
    minX -= pad; maxX += pad; minY -= pad; maxY += pad;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    ctx.fillStyle = MINIMAP_BG;
    ctx.fillRect(0, 0, mw, mh);
    ctx.strokeStyle = MINIMAP_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, mw, mh);

    // Nodes as dots
    for (const n of nodes) {
      const mx = ((n.x - minX) / rangeX) * mw;
      const my = ((n.y - minY) / rangeY) * mh;
      ctx.fillStyle = "#7a7a99";
      ctx.fillRect(mx - 1, my - 1, 2, 2);
    }

    // Viewport rect
    const vx1 = ((cam.x - w / 2 / cam.zoom - minX) / rangeX) * mw;
    const vy1 = ((cam.y - h / 2 / cam.zoom - minY) / rangeY) * mh;
    const vw = (w / cam.zoom / rangeX) * mw;
    const vh = (h / cam.zoom / rangeY) * mh;
    ctx.strokeStyle = "#c84b0e";
    ctx.lineWidth = 1;
    ctx.strokeRect(vx1, vy1, vw, vh);
  }

  // Animation loop
  useEffect(() => {
    if (nodesRef.current.length === 0) return;
    let raf: number;
    const tick = () => {
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw, nodesRef]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Mouse handlers
  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const screenToWorld = (sx: number, sy: number) => {
    const cam = camera.current;
    const canvas = canvasRef.current!;
    return {
      x: (sx - canvas.width / 2) / cam.zoom + cam.x,
      y: (sy - canvas.height / 2) / cam.zoom + cam.y,
    };
  };

  const findNodeAt = (wx: number, wy: number) => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const r = NODE_RADIUS[n.node_type] ?? 8;
      const dx = n.x - wx;
      const dy = n.y - wy;
      if (dx * dx + dy * dy < r * r * 1.5) return n;
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const world = screenToWorld(pos.x, pos.y);
    const hit = findNodeAt(world.x, world.y);

    if (hit && e.button === 0) {
      setDragging(hit.id);
      setSelectedNode(hit);
    } else if (e.button === 0) {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, cx: camera.current.x, cy: camera.current.y };
      setSelectedNode(null);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);

    if (dragging) {
      const world = screenToWorld(pos.x, pos.y);
      const nd = nodesRef.current.find((n) => n.id === dragging);
      if (nd) {
        nd.x = world.x;
        nd.y = world.y;
        nd.vx = 0;
        nd.vy = 0;
      }
    } else if (isPanning.current) {
      const cam = camera.current;
      const dx = (e.clientX - panStart.current.x) / cam.zoom;
      const dy = (e.clientY - panStart.current.y) / cam.zoom;
      camera.current = {
        x: panStart.current.cx - dx,
        y: panStart.current.cy - dy,
        zoom: cam.zoom,
      };
    }
  };

  const onMouseUp = () => {
    setDragging(null);
    isPanning.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const cam = camera.current;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, cam.zoom * zoomFactor));
    camera.current = { ...cam, zoom: newZoom };
  };

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-2">No graph data yet</p>
          <p className="text-text-muted text-sm">
            Run a scan first — the graph will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ cursor: dragging ? "grabbing" : isPanning.current ? "grab" : "default" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Minimap */}
      <canvas
        ref={minimapRef}
        width={160}
        height={100}
        className="absolute bottom-3 right-3 border border-border rounded opacity-80"
      />
      {/* Node details */}
      <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
      {/* Stats bar */}
      {context && (
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="text-[10px] bg-surface border border-border rounded px-2 py-1 text-text-secondary">
            {graphData.nodes.length} nodes
          </span>
          <span className="text-[10px] bg-surface border border-border rounded px-2 py-1 text-text-secondary">
            {graphData.edges.length} edges
          </span>
          <span className="text-[10px] bg-surface border border-border rounded px-2 py-1 text-accent">
            {context.domain}
          </span>
        </div>
      )}
    </div>
  );
}
