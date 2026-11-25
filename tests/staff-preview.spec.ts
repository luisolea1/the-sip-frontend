import { expect, test } from "@playwright/test";

test("el ticket suma cantidades y calcula el cambio sin conservar la venta", async ({ page }) => {
  await page.goto("/caja/venta");
  const catalog = page.getByRole("region", { name: "Menú de productos" });
  const ticket = page.getByRole("region", { name: "Ticket actual" });
  await catalog.getByRole("button", { name: /Añadir Latte, Chico/ }).click();
  await catalog.getByRole("button", { name: "Panadería" }).click();
  await expect(catalog.getByRole("button", { name: /Añadir Latte/ })).toHaveCount(0);
  await catalog.getByRole("button", { name: /Añadir Muffin/ }).click();

  const width = page.viewportSize()!.width;
  const menuBox = (await catalog.boundingBox())!;
  const ticketBox = (await ticket.boundingBox())!;
  if (width < 832) {
    expect(ticketBox.y).toBeGreaterThanOrEqual(menuBox.y + menuBox.height);
    await page.getByRole("link", { name: "Ver ticket" }).click();
    await expect(ticket).toBeInViewport();
  } else {
    expect(ticketBox.x).toBeGreaterThanOrEqual(menuBox.x + menuBox.width);
    await expect(page.getByRole("link", { name: "Ver ticket" })).toBeHidden();
  }
  await ticket.getByRole("button", { name: /Añadir una unidad de Latte/ }).click();
  await ticket.getByLabel("Efectivo recibido").fill("200");
  await expect(ticket.getByText("Cambio: $28.00")).toBeVisible();
  await ticket.getByLabel("Mixto").check();
  await ticket.getByLabel("Parte en efectivo").fill("100");
  await expect(ticket.getByText("Parte en tarjeta: $72.00")).toBeVisible();
  await ticket.getByRole("button", { name: /Quitar una unidad de Muffin/ }).click();
  await expect(ticket.getByText("Parte en tarjeta: $30.00")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.reload();
  await expect(ticket.getByText("Añade un producto del menú para empezar.")).toBeVisible();
});

test("el resumen y las compras reflejan sus filtros solo hasta recargar", async ({ page }) => {
  await page.goto("/administrador");
  const summary = page.getByRole("region", { name: "Resumen de ventas" });
  const sales = page.getByRole("region", { name: "Ventas recientes" });
  await expect(summary).toContainText("$402.00");
  await page.getByLabel("Periodo").selectOption("yesterday");
  await expect(summary).toContainText("$273.00");
  await expect(summary).toContainText("$91.00");
  await expect(sales.getByRole("listitem")).toHaveCount(3);
  await expect(page.getByText("Leche entera")).toBeVisible();
  await expect(page.getByText("Vasos de 12 oz")).toBeHidden();
  await page.getByLabel("Solo insumos por reponer").uncheck();
  await expect(page.getByText("Vasos de 12 oz")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.reload();
  await expect(summary).toContainText("$402.00");
  await expect(page.getByText("Vasos de 12 oz")).toBeHidden();
});
