import { defineConfig, devices } from "@playwright/test";

// Porta dedicada aos testes, diferente da 3000 usada no dia a dia
// (npm run dev/start), pra podermos rodar os testes sem derrubar um
// servidor de desenvolvimento que já esteja aberto.
const PORT = 4300;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Um worker só: o servidor do "vinext dev" compila cada módulo JS sob
  // demanda (não é um bundle único). A primeira navegação real do
  // Chromium é "fria" e baixa dezenas de módulos de uma vez — rodar tudo
  // em série evita vários testes brigando pela mesma compilação fria ao
  // mesmo tempo, o que estourava o timeout de navegação.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  timeout: 60_000,

  use: {
    baseURL: BASE_URL,
    // guarda o "trace" (linha do tempo com DOM, rede e screenshots) só
    // quando um teste falhar na primeira tentativa — dá pra investigar
    // sem deixar toda execução mais lenta.
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Usamos "vinext dev" (Cloudflare Workers simulado via Miniflare) em vez
  // de "vinext build && vinext start": o servidor de preview local do
  // vinext (start) tem um bug conhecido nesta versão (0.0.50) — ele chama
  // o worker com env=undefined, então env.ASSETS/env.IMAGES quebram e o
  // CSS/imagens voltam 404 (bug pré-existente do pacote, não deste
  // projeto — reproduzido com curl, fora do Playwright, pra confirmar).
  // "vinext dev" passa pelo Miniflare de verdade, com os bindings do
  // vite.config.ts, e é o que já validamos manualmente antes.
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
