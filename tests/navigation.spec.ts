import { test, expect } from "@playwright/test";

test("las cuatro áreas admiten navegación y recarga sin desbordamiento", async ({ page }) => {
  await page.goto("/");
  const destinations = [
    { link: "Registro", path: "/registro-miembros", title: "Registro de miembros" },
    { link: "Acceder a mi tarjeta", path: "/mi-tarjeta", title: "Mi tarjeta" },
    { link: "Caja", path: "/caja/venta", title: "Punto de venta" },
    { link: "Administración", path: "/dueno", title: "Administración" },
  ];
  for (const { link, path, title } of destinations) {
    await page.getByRole("link", { name: link, exact: true }).click();
    await expect(page).toHaveURL(url => url.pathname === path);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} | THE SIP`);
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
