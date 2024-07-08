import { defineConfig } from "vite";
import wasmPack from "dzejkop-vite-plugin-wasm-pack";

export default defineConfig({
  // pass your local crate path to the plugin
  plugins: [wasmPack([], ["gb-noise"])],
});
