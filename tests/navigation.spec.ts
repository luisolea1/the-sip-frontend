import { test, expect } from "@playwright/test";

test("el portal de miembros enlaza registro y tarjeta sin mostrar áreas del personal", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(url => url.pathname === "/registro-miembros");
  const staffLinks = page.locator('a[href^="/caja"], a[href^="/dueno"]');
  await expect(staffLinks).toHaveCount(0);
  await page.getByRole("link", { name: "Acceder a mi tarjeta" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mi tarjeta");
  await expect(staffLinks).toHaveCount(0);
  await page.getByRole("link", { name: "Volver al registro de miembros" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Registro de miembros");
});

test("las cuatro páginas admiten acceso directo y recarga sin desbordamiento", async ({ page }) => {
  const destinations = [
    { path: "/registro-miembros", title: "Registro de miembros", staff: false },
    { path: "/mi-tarjeta", title: "Mi tarjeta", staff: false },
    { path: "/caja/venta", title: "Punto de venta", staff: true },
    { path: "/dueno", title: "Administración", staff: true },
  ];
  for (const { path, title, staff } of destinations) {
    await page.goto(path);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} | THE SIP`);
    if (staff) {
      await expect(page.locator('a[href="/registro-miembros"], a[href="/mi-tarjeta"]')).toHaveCount(0);
    }
    const fitsViewport = await page.evaluate(async () => {
      await document.fonts.ready;
      const root = document.documentElement;
      return root.scrollWidth <= root.clientWidth;
    });
    expect(fitsViewport).toBe(true);
  }
});

test("una dirección desconocida ofrece un enlace de regreso al registro", async ({ page }) => {
  await page.goto("/ruta-inexistente");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página no encontrada");
  await page.getByRole("link", { name: "Ir al registro de miembros" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Registro de miembros");
});
