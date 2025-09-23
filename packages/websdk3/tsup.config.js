import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/index.ts"],
  sourcemap: true,
  globalName: "LoginID",
  format: ["esm", "cjs", "iife"],
  minify: true,
  noExternal: ["@loginid/core"],
  dts: false,
  onSuccess: "dts-bundle-generator -o dist/index.d.ts --export-referenced-types false  src/index.ts"
})
