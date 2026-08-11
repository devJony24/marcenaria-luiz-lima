import { test, expect } from "@playwright/test";

test.describe("Imagens e vídeos", () => {
  test("nenhuma imagem, poster ou vídeo falha ao carregar", async ({ page, request }) => {
    const failedRequests: string[] = [];

    // "requestfailed" pega falhas de rede de verdade (DNS, conexão recusada
    // etc). "response" com status >= 400 pega os casos mais comuns, tipo um
    // 404 de arquivo que não existe em public/.
    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.url()} — ${request.failure()?.errorText}`);
    });
    page.on("response", (response) => {
      const url = response.url();
      const isMedia = /\.(webp|png|jpe?g|svg|mp4)(\?|$)/i.test(url) || url.includes("/_vinext/image");
      if (isMedia && response.status() >= 400) {
        failedRequests.push(`${response.status()} — ${url}`);
      }
    });

    await page.goto("/");

    // os cards de projeto usam loading="lazy": só pedem a imagem quando
    // entram na viewport. Desço em passos (em vez de pular direto pro
    // fim) pra não disparar todas as imagens de otimização de uma vez só
    // — o serviço remoto de resize em dev local aguenta melhor em rajadas
    // menores.
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < pageHeight; y += 800) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(150);
    }
    await page.waitForLoadState("networkidle");

    // Se a chamada remota de otimização de imagem falhar feio o
    // suficiente, o Vite (só em modo dev — isso nunca aparece pra um
    // usuário real em produção) cobre a página inteira com um overlay de
    // erro, que bloqueia qualquer clique. Removo o overlay se ele
    // aparecer: o conteúdo da página em si continua íntegro por baixo.
    const dismissViteOverlay = () =>
      page.evaluate(() => document.querySelector("vite-error-overlay")?.remove());
    await dismissViteOverlay();

    // os vídeos só existem no DOM depois de clicar em "Reproduzir" (ver
    // components/VideoGallery.tsx) — sem isso, o .mp4 nunca seria pedido.
    const initialButtons = await page.getByRole("button", { name: /^Reproduzir/ }).all();
    const videoTitles = await Promise.all(
      initialButtons.map((button) => button.getAttribute("aria-label")),
    );
    expect(videoTitles.length, "esperava encontrar pelo menos um vídeo na galeria").toBeGreaterThan(0);

    for (const title of videoTitles) {
      await dismissViteOverlay();
      await page.getByRole("button", { name: title!, exact: true }).click();
      const video = page.locator("video[data-video-id]");
      await expect(video).toBeVisible();
      // espera o navegador confirmar que baixou metadados suficientes do
      // vídeo (duração, dimensões) — prova de que o .mp4 respondeu certo.
      await video.evaluate(
        (el: HTMLVideoElement) =>
          el.readyState >= 1
            ? Promise.resolve()
            : new Promise((resolve) => el.addEventListener("loadedmetadata", resolve, { once: true })),
      );
    }

    // checagem extra: toda <img> que o navegador considera "completa" mas
    // tem naturalWidth 0 é uma imagem quebrada (ex: src apontando pra nada),
    // mesmo que o request técnico não tenha voltado como erro HTTP.
    const brokenImages = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"))
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );

    // A rota /_vinext/image redimensiona a imagem chamando um serviço
    // remoto da Cloudflare mesmo em dev local (não é processamento nativo
    // como seria na Cloudflare de verdade) — nesse ambiente, essa chamada
    // externa falha às vezes por instabilidade de rede, não por um bug do
    // site. Em vez de aceitar a falha de cara, refaço a requisição
    // isolada algumas vezes: se ela realmente estiver quebrada, vai
    // continuar falhando; se foi só uma soluço de rede, passa.
    const stillFailing: string[] = [];
    for (const entry of failedRequests) {
      const url = entry.match(/https?:\/\/\S+/)?.[0] ?? entry;
      if (!url.includes("/_vinext/image")) {
        stillFailing.push(entry);
        continue;
      }
      let recovered = false;
      for (let attempt = 0; attempt < 3 && !recovered; attempt++) {
        if (attempt > 0) await page.waitForTimeout(500);
        const retryResponse = await request.get(url).catch(() => null);
        if (retryResponse?.ok()) recovered = true;
      }
      if (!recovered) stillFailing.push(entry);
    }

    expect(stillFailing, `recursos com erro (após novas tentativas):\n${stillFailing.join("\n")}`).toEqual([]);
    expect(brokenImages, `imagens quebradas (0px):\n${brokenImages.join("\n")}`).toEqual([]);
  });
});
