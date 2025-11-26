import React, { useEffect } from "react";

/**
 * LoadingSpinner
 * - SVG-based rings for crisp edges
 * - animated cyan sweep arc, subtle inner rotating ring
 * - inner dotted circle
 * - glossy glass center + soft particle background
 *
 * Props:
 * - size: diameter in px (default 400)
 * - text: center text
 * - fullscreen: whether to center full-screen
 */
const LoadingSpinner = ({ size = 420, text = "Loading...", fullScreen = true }) => {
  const stroke = 14; // outer ring stroke
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // small perf nicety: reduce motion if prefers-reduced-motion is set
    // (optional enhancement)
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${fullScreen ? "min-h-screen w-full" : "py-8"} 
        bg-gradient-to-b from-[#04151a] via-[#04222a] to-[#02060a] flex items-center justify-center`}
    >
      {/* faint particles / bokeh (pure CSS) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-10 w-96 h-96 rounded-full opacity-10 blur-3xl bg-cyan-500" />
        <div className="absolute right-10 bottom-12 w-72 h-72 rounded-full opacity-7 blur-2xl bg-blue-600" />
        <div className="absolute left-1/2 top-6 w-44 h-44 rounded-full opacity-6 blur-2xl bg-sky-500" />
      </div>

      {/* main spinner */}
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        {/* soft white cyan halo */}
        <div
          className="absolute rounded-full blur-2xl opacity-75 animate-pulse"
          style={{
            width: size * 0.85,
            height: size * 0.85,
            background:
              "radial-gradient(closest-side, rgba(180,255,255,0.22), rgba(20,40,60,0.0) 60%)",
            filter: "blur(28px)",
          }}
        />

        {/* SVG rings */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10">
          <defs>
            {/* gradient for the bright sweep */}
            <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d8ffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#9ff6ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#55f0ff" stopOpacity="1" />
            </linearGradient>

            {/* subtle dark metallic for outer ring */}
            <linearGradient id="outerDark" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#071216" />
              <stop offset="50%" stopColor="#0b2a2e" />
              <stop offset="100%" stopColor="#071216" />
            </linearGradient>
          </defs>

          {/* Outer glossy ring (dark metallic) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#outerDark)"
            strokeWidth={stroke}
            style={{
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
              opacity: 0.95,
            }}
          />

          {/* Subtle inner inset ring to create depth */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - stroke * 0.9}
            fill="none"
            stroke="rgba(10,30,32,0.4)"
            strokeWidth={8}
            strokeDasharray={`${circumference * 0.98} ${circumference * 0.02}`}
            transform={`rotate(90 ${size / 2} ${size / 2})`}
            style={{ mixBlendMode: "overlay" }}
          />

          {/* Rotating faint segment on outer ring (dark slice) */}
          <g style={{ transformOrigin: "50% 50%", transformBox: "fill-box", animation: "spinSlow 6s linear infinite" }}>
            <path
              d={describeArcPath(size / 2, size / 2, radius, -20, 30)}
              stroke="#021214"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* Bright sweep arc (animated stroke-dashoffset for sweep) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#sweepGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.28} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: "drop-shadow(0 0 28px rgba(90,230,255,0.9))",
              animation: "sweep 1.6s cubic-bezier(.2,.9,.25,1) infinite",
            }}
          />

          {/* inner dotted ring: draw small dashes by stroke-dasharray on a smaller circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius * 0.62}
            fill="none"
            stroke="#8ee2ea"
            strokeOpacity="0.45"
            strokeWidth={6}
            strokeLinecap="butt"
            strokeDasharray="4 8"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: "drop-shadow(0 0 6px rgba(120,220,230,0.25))" }}
          />

          {/* thin glass ring (subtle highlight) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius * 0.78}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={2}
            transform={`rotate(20 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* glass center (translucent plate) */}
        <div
          aria-hidden
          style={{
            width: size * 0.48,
            height: size * 0.48,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.03), rgba(6,20,22,0.45) 40%)",
            border: "1px solid rgba(255,255,255,0.03)",
            boxShadow: "inset 0 6px 20px rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
          }}
          className="absolute z-20 flex items-center justify-center"
        >
          {/* center text */}
          <div className="text-center text-[14px] text-cyan-100/90 font-medium tracking-wider z-30">
            <div style={{ color: "rgba(255,255,255,0.92)" }}>{text}</div>
          </div>
        </div>
      </div>

      {/* animations styles */}
      <style>{`
        @keyframes sweep {
          0% {
            stroke-dasharray: ${circumference * 0.02} ${circumference};
            transform: rotate(-90deg);
            opacity: 0.0;
          }
          10% {
            stroke-dasharray: ${circumference * 0.18} ${circumference};
            opacity: 0.85;
          }
          60% {
            stroke-dasharray: ${circumference * 0.28} ${circumference};
            opacity: 1;
          }
          100% {
            stroke-dasharray: ${circumference * 0.02} ${circumference};
            transform: rotate(270deg);
            opacity: 0.0;
          }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Reduce motion for users who prefer that */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse, svg { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

/**
 * Helper: build an SVG path for a circular arc between two angles (degrees).
 * Returns an absolute path string (moveTo + arc).
 *
 * Used for the subtle dark slice path.
 */
function describeArcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}
