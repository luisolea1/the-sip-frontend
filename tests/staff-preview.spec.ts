import { expect, test } from "@playwright/test";

test("una venta mixta aplica empaques y sellos una sola vez al confirmar", async ({ page }) => {
  await page.goto("/caja/venta");
  const nav = page.getByRole("navigation", { name: "Operación de caja" });
  const ticket = page.getByRole("region", { name: "Ticket actual" });
  await page.getByRole("button", { name: /Añadir Latte, Chico/ }).click({ clickCount: 2 });
  await page.getByRole("button", { name: /Añadir Muffin/ }).click();
  await ticket.getByRole("button", { name: "Para llevar" }).first().click();
  await ticket.getByRole("button", { name: "Para llevar" }).last().click();
  await ticket.getByLabel("Mixto").check();
  await ticket.getByLabel("Parte en efectivo").fill("100");
  await ticket.getByLabel("Voucher de ejemplo").fill("00123");
  await ticket.getByRole("link", { name: "Simular escaneo de QR" }).click();
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("01725");
  await page.getByRole("button", { name: "Usar en esta venta" }).click();
  await expect(ticket).toContainText("María García");
  await nav.getByRole("link", { name: "Caja" }).click();
  await expect(page.getByText("85 pzas.")).toBeVisible();
  await expect(page.getByText("36 pzas.")).toBeVisible();
  await nav.getByRole("link", { name: "Venta" }).click();
  await expect(ticket).toContainText("Parte en tarjeta: $72.00");
  await ticket.getByRole("button", { name: "Confirmar venta simulada" }).click();
  await expect(ticket).toContainText("Venta simulada 0059 confirmada");
  await expect(ticket.getByRole("button", { name: "Confirmar venta simulada" })).toHaveCount(0);
  await nav.getByRole("link", { name: "Caja" }).click();
  await expect(page.getByText("84 pzas.")).toBeVisible();
  await expect(page.getByText("35 pzas.")).toBeVisible();
  await expect(page.getByText("$602.00", { exact: true })).toBeVisible();
  await expect(page.getByText("$272.00", { exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Miembros" }).click();
  await page.getByLabel("Buscar por nombre o número de miembro").fill("maria");
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("10 / 10 cafés");
  await page.reload();
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("8 / 10 cafés");
});

test("el cajero distingue homónimos por número y confirma la asociación manual", async ({ page }) => {
  await page.goto("/caja/miembros");
  await page.getByRole("button", { name: "Nuevo miembro" }).click();
  await page.getByLabel("Nombre", { exact: true }).fill("María García");
  await page.getByLabel("Correo electrónico").fill("otra.maria@example.com");
  await page.getByRole("button", { name: "Crear miembro de ejemplo" }).click();
  const search = page.getByRole("searchbox");
  await search.fill("garcia");
  await expect(page.getByRole("button", { name: /María García · Nº/ })).toHaveCount(2);
  await search.fill("01727");
  await page.getByRole("button", { name: "Usar en esta venta" }).click();
  await expect(page.getByText("María García · Nº 01727")).toBeVisible();
  await page.getByRole("button", { name: "Quitar miembro" }).click();
  await expect(page.getByText("María García · Nº 01727")).toBeHidden();
});

test("el corte concilia entradas y retiros y el siguiente turno empieza con su propio fondo", async ({ page }) => {
  await page.goto("/caja/turno");
  await page.getByRole("button", { name: "Entrada", exact: true }).click();
  await page.getByLabel("Importe de entrada").fill("50");
  await expect(page.getByRole("button", { name: "Registrar entrada" })).toBeDisabled();
  await page.getByLabel("Motivo").fill("Cambio para billetes");
  await page.getByRole("button", { name: "Registrar entrada" }).click();
  await page.getByRole("button", { name: "Retiro", exact: true }).click();
  await page.getByLabel("Importe de retiro").fill("20");
  await page.getByLabel("Motivo").fill("Resguardo");
  await page.getByRole("button", { name: "Registrar retiro" }).click();
  await page.getByRole("button", { name: "Hacer corte" }).click();
  await page.getByLabel("Efectivo contado").fill("530");
  await expect(page.getByText("Diferencia: -$2.00")).toBeVisible();
  await page.getByRole("button", { name: "Confirmar corte" }).click();
  await expect(page.getByRole("heading", { name: "Caja cerrada" })).toBeVisible();
  await page.getByRole("link", { name: "Venta", exact: true }).click();
  await page.getByRole("button", { name: /Añadir Latte, Chico/ }).click();
  await page.getByLabel("Efectivo recibido").fill("65");
  await expect(page.getByRole("button", { name: "Confirmar venta simulada" })).toBeDisabled();
  await page.getByRole("link", { name: "Abrir turno" }).click();
  await page.getByRole("button", { name: "Abrir nuevo turno" }).click();
  await page.getByLabel("Fondo inicial").fill("300");
  await page.getByRole("button", { name: "Abrir turno", exact: true }).click();
  await expect(page.getByRole("region", { name: "Efectivo esperado" })).toContainText("$300.00");
  await expect(page.getByText("Ventas registradas").locator("..")).toContainText("$0.00");
});

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
