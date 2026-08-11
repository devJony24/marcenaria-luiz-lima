import { test, expect } from "@playwright/test";

// Número oficial usado em todo o site (ver app/page.tsx e
// components/ContactSelector.tsx) — se o número mudar de verdade, é aqui
// que se atualiza o teste também.
const WHATSAPP_NUMBER = "554898307060";

test.describe("Links de WhatsApp", () => {
  test("existem links de WhatsApp na página e todos usam o número correto", async ({ page }) => {
    await page.goto("/");

    const waLinks = page.locator(`a[href^="https://wa.me/${WHATSAPP_NUMBER}"]`);
    const waCount = await waLinks.count();
    expect(waCount, "esperava pelo menos um link de WhatsApp na página").toBeGreaterThan(0);

    const hrefs = await waLinks.evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      expect(href).toMatch(new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}(\\?|$)`));
    }

    // links externos com target="_blank" sem rel="noreferrer" são uma
    // vulnerabilidade conhecida (reverse tabnabbing) — vale conferir junto.
    const targets = await waLinks.evaluateAll((links) => links.map((a) => a.getAttribute("target")));
    const rels = await waLinks.evaluateAll((links) => links.map((a) => a.getAttribute("rel")));
    for (const target of targets) expect(target).toBe("_blank");
    for (const rel of rels) expect(rel).toContain("noreferrer");

    // o card de contato também oferece o número em formato de telefone —
    // mesmo número, formato diferente (tel: em vez de wa.me).
    const telLink = page.locator(`a[href="tel:+${WHATSAPP_NUMBER}"]`);
    await expect(telLink).toHaveCount(1);

    // o botão flutuante de WhatsApp (sempre visível, ancorado na tela) é o
    // CTA mais usado num site como esse — vale um teste dedicado. Uso a
    // classe pra achar ele: por nome acessível ("Falar no WhatsApp") ele
    // empata com o link de texto do hero, que também se chama assim por
    // causa do "●" decorativo lido junto com o texto.
    await expect(page.locator("a.floating-wa")).toBeVisible();
  });
});
