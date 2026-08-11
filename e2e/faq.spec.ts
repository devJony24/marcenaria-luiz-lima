import { test, expect } from "@playwright/test";

test.describe("Perguntas frequentes (FAQ)", () => {
  test("a primeira pergunta já carrega aberta", async ({ page }) => {
    // Isso é intencional no componente (openFaq inicia em 0, não em null) —
    // um teste ingênuo que assume "tudo começa fechado" quebraria aqui.
    await page.goto("/");
    // em dev, o React só "hidrata" (liga os onClick) depois de baixar e
    // rodar dezenas de módulos JS separados — clicar cedo demais parece
    // funcionar (o botão existe) mas não faz nada, porque o handler ainda
    // não foi conectado. Esperar a rede acalmar dá tempo pra hidratação.
    await page.waitForLoadState("networkidle");

    const firstQuestion = page.getByRole("button", { name: "Atende toda Florianópolis?" });
    const firstItem = page.locator(".faq-item").filter({ has: firstQuestion });

    await expect(firstItem).toHaveClass(/open/);
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(firstItem.locator(".faq-answer")).toBeVisible();
  });

  test("clicar numa pergunta abre ela e fecha a que estava aberta (acordeão de item único)", async ({
    page,
  }) => {
    await page.goto("/");
    // em dev, o React só "hidrata" (liga os onClick) depois de baixar e
    // rodar dezenas de módulos JS separados — clicar cedo demais parece
    // funcionar (o botão existe) mas não faz nada, porque o handler ainda
    // não foi conectado. Esperar a rede acalmar dá tempo pra hidratação.
    await page.waitForLoadState("networkidle");

    const firstQuestion = page.getByRole("button", { name: "Atende toda Florianópolis?" });
    const secondQuestion = page.getByRole("button", { name: "Como solicitar orçamento?" });
    const firstItem = page.locator(".faq-item").filter({ has: firstQuestion });
    const secondItem = page.locator(".faq-item").filter({ has: secondQuestion });

    await secondQuestion.click();

    await expect(secondItem).toHaveClass(/open/);
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(secondItem.locator(".faq-answer")).toBeVisible();

    // a resposta da .faq-answer usa "grid-template-rows: 0fr" quando
    // fechada (ver app/globals.css) — ou seja, ela não some do DOM, só
    // fica com altura 0. toBeVisible()/not.toBeVisible() já considera
    // isso, então dá pra confiar nele em vez de checar só a classe CSS.
    await expect(firstItem).not.toHaveClass(/open/);
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    await expect(firstItem.locator(".faq-answer")).not.toBeVisible();
  });

  test("clicar de novo na mesma pergunta fecha ela", async ({ page }) => {
    await page.goto("/");
    // em dev, o React só "hidrata" (liga os onClick) depois de baixar e
    // rodar dezenas de módulos JS separados — clicar cedo demais parece
    // funcionar (o botão existe) mas não faz nada, porque o handler ainda
    // não foi conectado. Esperar a rede acalmar dá tempo pra hidratação.
    await page.waitForLoadState("networkidle");

    const firstQuestion = page.getByRole("button", { name: "Atende toda Florianópolis?" });
    const firstItem = page.locator(".faq-item").filter({ has: firstQuestion });

    // já começa aberta — clicar uma vez fecha
    await firstQuestion.click();

    await expect(firstItem).not.toHaveClass(/open/);
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    await expect(firstItem.locator(".faq-answer")).not.toBeVisible();
  });
});
