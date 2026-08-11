import { test, expect } from "@playwright/test";

test.describe("Carregamento sem erros", () => {
  test("a home carrega sem console.error nem exceções JS não tratadas", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    // "console" dispara pra qualquer mensagem que o navegador loga (log,
    // info, warn, error...). Só nos interessa "error": warnings e logs são
    // normais e não devem quebrar o teste.
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // "pageerror" é um canal diferente: dispara quando o JS da página lança
    // uma exceção que ninguém capturou (ex: TypeError num efeito do React).
    // Isso não passa por console.error, por isso escutamos os dois.
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto("/");
    expect(response?.status(), "a home deveria responder com sucesso (2xx)").toBeLessThan(400);

    // espera a rede "assentar" (sem requisições pendentes por 500ms) pra dar
    // tempo de fontes, imagens com priority e efeitos de hidratação rodarem
    // antes de conferirmos os erros.
    await page.waitForLoadState("networkidle");

    expect(consoleErrors, `console.error encontrados:\n${consoleErrors.join("\n")}`).toEqual([]);
    expect(pageErrors, `exceções JS não tratadas:\n${pageErrors.join("\n")}`).toEqual([]);
  });
});
