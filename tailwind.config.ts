import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { fontFamily: { display: ["Space Grotesk", "sans-serif"], sans: ["Inter", "sans-serif"] }, colors: { ink: "#101014" } } }, plugins: [] };
export default config;
