import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default defineConfig({
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "iife", // Or 'es' for ES modules
    globals: {
      $: "jQuery",
      "jarallax/dist/jarallax.min": "Jarallax",
    },
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), typescript(), json()],
  external: ["jquery", "jarallax/dist/jarallax.min"],
});
