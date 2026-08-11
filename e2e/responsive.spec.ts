import { test, expect } from "@playwright/test";

async function hasHorizontalOverflow(page: import("@playwright/test").Page) {
  // bug clássico de responsividade: algum elemento mais largo que a tela
  // força uma barra de rolagem horizontal. scrollWidth > clientWidth
  // detecta isso de forma confiável em qualquer viewport.
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}

test.describe("Desktop (1280x800)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("conteúdo principal aparece e o menu hambúrguer fica escondido", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Solicitar orçamento/ }).first()).toBeVisible();

    // acima de 980px a navegação normal aparece e o botão hambúrguer some
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();

    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});

test.describe("Mobile (390x844, tamanho de um iPhone comum)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("conteúdo principal aparece e o botão hambúrguer fica visível", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Solicitar orçamento/ }).first()).toBeVisible();

    // abaixo de 980px é o oposto: hambúrguer visível, nav some até abrir
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();

    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});
