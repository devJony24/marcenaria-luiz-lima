import { test, expect } from "@playwright/test";

// O botão hambúrguer só existe visualmente abaixo de 980px de largura
// (ver app/globals.css, ".menu-button { display: none }" no desktop) —
// por isso este arquivo fixa um viewport de celular, independente do
// projeto/viewport padrão configurado no playwright.config.ts.
test.use({ viewport: { width: 390, height: 844 } });

test.describe("Menu mobile", () => {
  test("abre ao clicar no botão e fecha ao clicar de novo", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle"); // dá tempo da hidratação ligar o onClick

    // Uso um locator de CSS (não getByRole) pra checar a classe/estado do
    // <nav>: quando fechado, o CSS aplica visibility:hidden nele — e
    // elementos com visibility:hidden são removidos da árvore de
    // acessibilidade, então getByRole("navigation") não o encontraria.
    // getByRole é ótimo pra simular "o que um usuário de leitor de tela
    // vê", mas errado pra inspecionar um elemento que existe no DOM só
    // visualmente escondido.
    const nav = page.locator("nav.main-nav");

    // estado inicial: fechado
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(nav).not.toHaveClass(/open/);

    // abre — o mesmo botão físico troca de rótulo pra "Fechar menu"
    // (é assim que a página sinaliza o estado pra leitores de tela)
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toHaveClass(/open/);
    // aqui sim getByRole faz sentido: o menu está aberto/visível, é
    // exatamente o que queremos confirmar que o usuário consegue ver.
    await expect(nav.getByRole("link", { name: "Serviços" })).toBeVisible();

    // fecha
    await page.getByRole("button", { name: "Fechar menu" }).click();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(nav).not.toHaveClass(/open/);
  });

  test("clicar em um link do menu fecha o menu sozinho", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("nav.main-nav");

    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(nav).toHaveClass(/open/);

    // comportamento implementado em app/page.tsx: cada link do menu chama
    // setMenuOpen(false) ao ser clicado, pra não deixar o menu aberto por
    // cima do conteúdo depois de navegar.
    await nav.getByRole("link", { name: "Serviços" }).click();
    await expect(nav).not.toHaveClass(/open/);
  });
});
