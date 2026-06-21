import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.jpg";

interface Props {
  onDone: () => void;
}

// 5 marta miltilash (400ms × 5 = 2s) + 8 marta tez (50ms × 8 = 0.4s) + tez yo'qolish
const BLINK_SLOW = 400;
const BLINK_FAST = 50;
const BLINK_COUNT_SLOW = 5;
const FAST_PAIRS = 8;

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"slow" | "fast" | "exit">("slow");
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const countRef = useRef(0);

  // Slow blink phase
  useEffect(() => {
    if (phase !== "slow") return;
    countRef.current = 0;
    const timer = setInterval(() => {
      countRef.current += 1;
      setOpen((o) => !o);
      if (countRef.current >= BLINK_COUNT_SLOW * 2) {
        clearInterval(timer);
        setPhase("fast");
        setOpen(false);
      }
    }, BLINK_SLOW);
    return () => clearInterval(timer);
  }, [phase]);

  // Fast blink phase
  useEffect(() => {
    if (phase !== "fast") return;
    countRef.current = 0;
    const timer = setInterval(() => {
      countRef.current += 1;
      setOpen((o) => !o);
      if (countRef.current >= FAST_PAIRS * 2) {
        clearInterval(timer);
        setPhase("exit");
        setExiting(true);
      }
    }, BLINK_FAST);
    return () => clearInterval(timer);
  }, [phase]);

  // Exit phase — scale up and fade
  useEffect(() => {
    if (phase !== "exit") return;
    const timer = setTimeout(() => onDone(), 300);
    return () => clearTimeout(timer);
  }, [phase, onDone]);

  const eyeOpacity = open ? 1 : 0.05;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "#08080f" }}
    >
      {/* Glow background */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: open ? "radial-gradient(circle, rgba(200,75,14,0.3) 0%, transparent 70%)" : "none",
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      />

      {/* Sauron Eye SVG */}
      <div
        className="relative"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scale(2)" : "scale(1)",
          transition: "all 0.3s ease-out",
        }}
      >
        <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
          {/* Outer eye shape */}
          <ellipse
            cx="100"
            cy="60"
            rx="90"
            ry="45"
            stroke="#c84b0e"
            strokeWidth="3"
            fill="none"
            style={{ opacity: 0.6 }}
          />
          {/* Inner iris ring */}
          <ellipse
            cx="100"
            cy="60"
            rx="70"
            ry="35"
            stroke="#c84b0e"
            strokeWidth="1.5"
            fill="none"
            style={{ opacity: 0.3 }}
          />
          {/* Iris glow */}
          <ellipse
            cx="100"
            cy="60"
            rx="50"
            ry="25"
            fill="none"
            style={{
              opacity: eyeOpacity,
              transition: "opacity 0.15s ease-in-out",
            }}
          >
            <animate attributeName="fill" values="#c84b0e;#ff6600;#c84b0e" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* Pupil */}
          <circle
            cx="100"
            cy="60"
            r={open ? 15 : 3}
            fill="#08080f"
            style={{
              transition: "r 0.15s ease-in-out",
            }}
          />
          {/* Pupil inner glow */}
          <circle
            cx="100"
            cy="60"
            r={open ? 8 : 1}
            fill="#c84b0e"
            style={{
              opacity: eyeOpacity,
              transition: "all 0.15s ease-in-out",
            }}
          />
          {/* Left veins */}
          <line x1="20" y1="55" x2="40" y2="58" stroke="#c84b0e" strokeWidth="1" style={{ opacity: eyeOpacity * 0.4 }} />
          <line x1="25" y1="50" x2="38" y2="55" stroke="#c84b0e" strokeWidth="0.8" style={{ opacity: eyeOpacity * 0.3 }} />
          {/* Right veins */}
          <line x1="180" y1="62" x2="160" y2="60" stroke="#c84b0e" strokeWidth="1" style={{ opacity: eyeOpacity * 0.4 }} />
          <line x1="175" y1="68" x2="162" y2="65" stroke="#c84b0e" strokeWidth="0.8" style={{ opacity: eyeOpacity * 0.3 }} />
          {/* Top/bottom veins */}
          <line x1="95" y1="18" x2="98" y2="32" stroke="#c84b0e" strokeWidth="0.8" style={{ opacity: eyeOpacity * 0.3 }} />
          <line x1="105" y1="102" x2="102" y2="88" stroke="#c84b0e" strokeWidth="0.8" style={{ opacity: eyeOpacity * 0.3 }} />
        </svg>
      </div>

      {/* Logo */}
      <div
        className="mt-8 flex flex-col items-center gap-3"
        style={{
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      >
        <img
          src={logo}
          alt="O'MOTIM"
          className="w-16 h-16 rounded-lg"
          style={{ imageRendering: "auto" }}
        />
        <div className="text-accent text-xl font-bold tracking-wider">O'MOTIM</div>
        <div className="text-text-muted text-xs font-mono">INITIATING RECON...</div>
      </div>
    </div>
  );
}
