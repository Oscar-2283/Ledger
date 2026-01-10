import { useTheme } from '../contexts/ThemeContext';

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top, #0a0a0f 0%, #050506 50%, #020203 100%)'
            : 'radial-gradient(ellipse at top, #F5F5F7 0%, #E5E5EA 50%, #D1D1D6 100%)'
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.015 : 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        {/* Primary blob - top center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[1400px] rounded-full blur-[150px] animate-float transition-opacity duration-300"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(94,106,210,0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(94,106,210,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Secondary blob - left side */}
        <div
          className="absolute top-1/4 -left-48 w-[600px] h-[800px] rounded-full blur-[120px] animate-float-slow transition-opacity duration-300"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(219,39,119,0.1) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(219,39,119,0.05) 50%, transparent 70%)',
            animationDelay: '2s',
          }}
        />

        {/* Tertiary blob - right side */}
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[700px] rounded-full blur-[100px] animate-float transition-opacity duration-300"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(94,106,210,0.08) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(94,106,210,0.05) 50%, transparent 70%)',
            animationDelay: '4s',
          }}
        />

        {/* Bottom accent blob */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[120px] animate-pulse-glow transition-opacity duration-300"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(94,106,210,0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(94,106,210,0.06) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.02 : 0.03,
          backgroundImage: isDark
            ? `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
