import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        surfaceStrong: "hsl(var(--surface-strong) / <alpha-value>)",
        text: "hsl(var(--text) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        olive: "hsl(var(--olive) / <alpha-value>)"
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        body: [
          "var(--font-body)",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(50, 39, 24, 0.12)"
      },
      letterSpacing: {
        editorial: "-0.04em"
      },
      backgroundImage: {
        paper:
          "radial-gradient(circle at top, rgba(196, 164, 105, 0.08), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0))"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" }
        }
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "drift 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
