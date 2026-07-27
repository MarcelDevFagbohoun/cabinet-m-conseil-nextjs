import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-alt": "rgb(var(--bg-alt) / <alpha-value>)",
        raised: "rgb(var(--bg-raised) / <alpha-value>)",
        "raised-2": "rgb(var(--bg-raised-2) / <alpha-value>)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        "gold-light": "rgb(var(--gold-light) / <alpha-value>)",
        "gold-deep": "rgb(var(--gold-deep) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-dim": "rgb(var(--ink-dim) / <alpha-value>)",
        "ink-faint": "rgb(var(--ink-faint) / <alpha-value>)",
        wine: "rgb(var(--wine) / <alpha-value>)",
        dark: "rgb(var(--dark) / <alpha-value>)",
        "on-dark": "rgb(var(--on-dark) / <alpha-value>)",
        "on-dark-dim": "rgb(var(--on-dark-dim) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "14px",
        lg: "28px",
      },
      maxWidth: {
        container: "1180px",
      },
      boxShadow: {
        card: "0 18px 50px -30px rgba(34,26,18,0.45)",
        raise: "0 28px 70px -40px rgba(34,26,18,0.6)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.22,.68,.16,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
