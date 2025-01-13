import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import container from "@tailwindcss/container-queries";
import { radixThemePreset } from "radix-themes-tw";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  presets: [radixThemePreset],
  plugins: [animate, typography, container],
};
