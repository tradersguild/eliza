import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: {
        entry: {
            index: "src/index.ts"
        }
    },
    external: [
        "@elizaos/core",
        "node-fetch"
    ]
});
