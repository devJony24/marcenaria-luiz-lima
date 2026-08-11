import { fileURLToPath } from "node:url";
import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// Local-dev-only ASSETS binding simulation: `vinext dev` serves straight from
// `public/`. `vinext build` overrides `directory` to the built `dist/client`
// output automatically (see @cloudflare/vite-plugin's getAssetsDirectory),
// keeping this `binding` name — so `vinext start` picks up dist/client too.
// Without this, `env.ASSETS` is undefined locally, breaking /_vinext/image
// and any direct static file (e.g. VideoGallery's <video src>) requests.
const localAssetsDirectory = fileURLToPath(new URL("./public", import.meta.url));

const localBindingConfig = {
  main: "./worker/index.ts",
  // compatibility_flags já vem de wrangler.jsonc (o plugin funde os dois:
  // esse objeto customiza por cima do arquivo encontrado no disco).
  // Repetir "nodejs_compat" aqui faz os arrays serem concatenados e o
  // Miniflare recusa a flag duplicada.
  assets: {
    directory: localAssetsDirectory,
    binding: "ASSETS",
  },
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
