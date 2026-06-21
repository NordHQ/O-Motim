import { useRef, useEffect, useCallback } from "react";
import type { GraphData, GraphNode } from "../../store/scanStore";

export interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Pop-in animatsiya — node birinchi marta paydo bo'lgan vaqt (performance.now()).
  animStart: number;
}

const REPULSION = 800;
const ATTRACTION = 0.005;
const DAMPING = 0.85;
const CENTER_GRAVITY = 0.01;
const MAX_VELOCITY = 8;
const SPAWN_DUR = 450; // pop-in animatsiya davomiyligi (ms)

// Pop-in scale — parasite uslubidagi ease-out-back.
// t = 0 → 0, t = 1 → 1.05 → 1.0
function spawnScale(t: number): number {
  if (t >= 1) return 1;
  // ease-out-back: 1 + c3 * (t-1)^3 + c1 * (t-1)^2
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return Math.max(0, 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2));
}

export function useForceLayout(data: GraphData | null) {
  const nodesRef = useRef<LayoutNode[]>([]);
  const rafRef = useRef<number>(0);
  const dataRef = useRef<GraphData | null>(null);
  // O'sha node ID'lari ro'yxati — init qilingan. Incremental yangilanish uchun.
  const initializedRef = useRef<Set<string>>(new Set());

  // Yangi node'larni qo'shish — eski node'larni saqlab, yangilarini atrofga joylashtiramiz.
  const syncNodes = useCallback((graph: GraphData) => {
    dataRef.current = graph;
    const existing = nodesRef.current;
    const existingIds = new Set(existing.map((n) => n.id));

    // Markazni hisoblaymiz — eski node'larning centroidi yoki (600, 400).
    let cx = 600;
    let cy = 400;
    if (existing.length > 0) {
      cx = existing.reduce((s, nd) => s + nd.x, 0) / existing.length;
      cy = existing.reduce((s, nd) => s + nd.y, 0) / existing.length;
    }

    const now = performance.now();
    const newNodes: LayoutNode[] = [];
    let i = 0;
    for (const n of graph.nodes) {
      if (!existingIds.has(n.id)) {
        const angle = Math.random() * Math.PI * 2;
        const r = 60 + Math.random() * 80;
        newNodes.push({
          ...n,
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          vx: 0,
          vy: 0,
          animStart: now,
        });
        i++;
      } else {
        // Eski node — ma'lumotlarini yangilaymiz (label/detail o'zgarishi mumkin).
        const old = existing.find((nd) => nd.id === n.id);
        if (old) {
          old.label = n.label;
          old.detail = n.detail;
          old.color = n.color;
        }
      }
    }

    if (newNodes.length > 0) {
      nodesRef.current = [...existing, ...newNodes];
      // Qisqa simulation restart — yangi node'lar joylashishini topish uchun.
      restartSimulation();
    }
  }, []);

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    const n = nodes.length;
    const cx = nodes.reduce((s, nd) => s + nd.x, 0) / n;
    const cy = nodes.reduce((s, nd) => s + nd.y, 0) / n;

    // Repulsion (Coulomb) — faqat to'liq pop-in bo'lgan node'lar hisobga olinadi.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) dist = 1;
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx += fx;
        nodes[i].vy += fy;
        nodes[j].vx -= fx;
        nodes[j].vy -= fy;
      }
    }

    // Attraction (edges)
    const graph = dataRef.current;
    if (graph) {
      for (const edge of graph.edges) {
        const src = nodes.find((nd) => nd.id === edge.source);
        const tgt = nodes.find((nd) => nd.id === edge.target);
        if (!src || !tgt) continue;
        let dx = tgt.x - src.x;
        let dy = tgt.y - src.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) dist = 1;
        const force = dist * ATTRACTION;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        src.vx += fx;
        src.vy += fy;
        tgt.vx -= fx;
        tgt.vy -= fy;
      }
    }

    // Center gravity + damping
    for (const nd of nodes) {
      nd.vx += (cx - nd.x) * CENTER_GRAVITY;
      nd.vy += (cy - nd.y) * CENTER_GRAVITY;
      nd.vx *= DAMPING;
      nd.vy *= DAMPING;
      const speed = Math.sqrt(nd.vx * nd.vx + nd.vy * nd.vy);
      if (speed > MAX_VELOCITY) {
        nd.vx = (nd.vx / speed) * MAX_VELOCITY;
        nd.vy = (nd.vy / speed) * MAX_VELOCITY;
      }
      nd.x += nd.vx;
      nd.y += nd.vy;
    }
  }, []);

  // Simulation — pop-in animatsiya davomida va bir muncha vaqt keyin ham ishlaydi.
  const restartSimulation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const steps = 200;
    let step = 0;
    const tick = () => {
      simulate();
      step++;
      // Pop-in animatsiyasi davom etayotgan node'lar bo'lsa — davom ettiramiz.
      const now = performance.now();
      const stillAnimating = nodesRef.current.some(
        (nd) => now - nd.animStart < SPAWN_DUR + 50
      );
      if (step < steps || stillAnimating) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [simulate]);

  // Boshlang'ich — butun graph yangidan kelsa (birinchi marta).
  useEffect(() => {
    if (!data || data.nodes.length === 0) return;

    // To'liq reset bo'lsa (yangi scan) — tozalaymiz.
    if (nodesRef.current.length === 0 || !initializedRef.current.has(data.nodes[0]?.id)) {
      if (nodesRef.current.length === 0) {
        initializedRef.current = new Set();
        nodesRef.current = [];
      }
    }

    syncNodes(data);
    // Agar hech qanday simulation boshlanmagan bo'lsa, boshlaymiz.
    if (rafRef.current === 0) {
      restartSimulation();
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [data, syncNodes, restartSimulation]);

  return nodesRef;
}

// Foydalanuvchi pop-in scale olishi uchun eksport qilamiz (GraphView ishlatadi).
export function getNodeScale(nd: LayoutNode): number {
  const now = performance.now();
  const elapsed = now - nd.animStart;
  if (elapsed >= SPAWN_DUR) return 1;
  const t = elapsed / SPAWN_DUR;
  return spawnScale(t);
}
