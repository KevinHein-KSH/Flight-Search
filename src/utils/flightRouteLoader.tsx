export function RadarFlightLoader() {
  return (
    <div className="relative w-40 h-40 rounded-full border border-slate-300 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full animate-radar bg-gradient-to-r from-emerald-400/30 to-transparent" />

      <div className="absolute text-lg animate-blip">✈️</div>
      <div className="absolute text-lg translate-x-6 -translate-y-4 animate-blip delay-300">
        ✈️
      </div>

      <style>{`
        .animate-radar {
          animation: sweep 1.6s linear infinite;
          transform-origin: center;
        }
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blip {
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
