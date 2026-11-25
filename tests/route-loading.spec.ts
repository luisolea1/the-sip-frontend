import { expect, test } from "@playwright/test";

test("la cabecera de administración permanece mientras llega el resumen", async ({ page }) => {
  let releasePage!: () => void;
  const pendingPage = new Promise<void>(resolve => { releasePage = resolve; });
  await page.route("**/AdminDashboardPage-*.js", async route => {
    await pendingPage;
    await route.continue();
  });
  await page.goto("/administrador", { waitUntil: "domcontentloaded" });
  const heading = page.getByRole("heading", { name: "Administración", level: 1 });
  try {
    await expect(heading).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Cargando resumen de administración");
    await expect(page.getByText("$402.00")).toHaveCount(0);
  } finally {
    releasePage();
  }
  await expect(page.getByRole("region", { name: "Resumen de ventas" })).toContainText("$402.00");
  await expect(heading).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
});
