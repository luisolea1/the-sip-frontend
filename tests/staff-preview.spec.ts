import { expect, test } from "@playwright/test";

test("una venta mixta aplica empaques y sellos una sola vez al confirmar", async ({ page }) => {
  await page.goto("/caja/venta");
  const nav = page.getByRole("navigation", { name: "Operación de caja" });
  const ticket = page.getByRole("region", { name: "Tu compra" });
  await page.getByRole("button", { name: /Añadir Latte, Chico/ }).click({ clickCount: 2 });
  await page.getByRole("button", { name: /Añadir Muffin/ }).click();
  await ticket.getByRole("button", { name: "Para llevar" }).first().click();
  await ticket.getByRole("button", { name: "Para llevar" }).last().click();
  await ticket.getByLabel("Mixto").check();
  await ticket.getByLabel("Parte en efectivo").fill("100");
  await ticket.getByLabel("Voucher de ejemplo").fill("00123");
  await expect(ticket.getByRole("link", { name: "Buscar miembro" })).toBeHidden();
  await ticket.locator("summary").press("Enter");
  await ticket.getByRole("link", { name: "Simular escaneo de QR" }).click();
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("01725");
  await page.getByRole("button", { name: "Usar en esta venta" }).click();
  await expect(ticket).toContainText("María García");
  await nav.getByRole("link", { name: "Caja" }).click();
  await expect(page.getByText("85 pzas.")).toBeVisible();
  await expect(page.getByText("36 pzas.")).toBeVisible();
  await nav.getByRole("link", { name: "Venta" }).click();
  await expect(ticket).toContainText("Parte en tarjeta: $72.00");
  const checkout = page.getByRole("region", { name: "Resumen de cobro" });
  await checkout.getByRole("button", { name: "Confirmar venta simulada" }).click();
  await expect(checkout).toContainText("Venta simulada 0059 confirmada");
  await expect(ticket).toContainText("Orden #0060");
  await expect(checkout.getByRole("button", { name: "Confirmar venta simulada" })).toHaveCount(0);
  await nav.getByRole("link", { name: "Caja" }).click();
  await expect(page.getByText("84 pzas.")).toBeVisible();
  await expect(page.getByText("35 pzas.")).toBeVisible();
  await expect(page.getByText("$602.00", { exact: true })).toBeVisible();
  await expect(page.getByText("$272.00", { exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Miembros" }).click();
  await page.getByLabel("Buscar por correo o número de miembro").fill("maria@example.com");
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("10 / 10 cafés");
  await page.reload();
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toHaveCount(0);
  await page.getByRole("searchbox").fill("01725");
  await expect(page.getByRole("region", { name: "Tarjeta seleccionada" })).toContainText("8 / 10 cafés");
});

test("al pasar del panel a caja no hay enlaces a administración ni miembros preseleccionados", async ({ page }) => {
  await page.goto("/administrador");
  await page.getByRole("link", { name: "Abrir punto de venta" }).click();
  const adminLink = page.locator('a[href^="/administrador"], a[href^="/dueno"]');
  await expect(page.getByRole("region", { name: "Tu compra" })).toBeVisible();
  await expect(adminLink).toHaveCount(0);
  await page.getByRole("link", { name: "Miembros", exact: true }).click();
  const card = page.getByRole("region", { name: "Tarjeta seleccionada" });
  const associate = page.getByRole("button", { name: "Usar en esta venta" });
  await expect(page.getByRole("heading", { name: "Tus miembros" })).toBeVisible();
  await expect(adminLink).toHaveCount(0);
  await expect(card).toHaveCount(0);
  await expect(associate).toHaveCount(0);
  await page.getByRole("button", { name: "Diego López · Nº 01726" }).click();
  await expect(card).toContainText("01726");
  await page.getByRole("searchbox").clear();
  await expect(card).toHaveCount(0);
  await expect(associate).toHaveCount(0);
  await page.getByRole("button", { name: "Diego López · Nº 01726" }).click();
  await associate.click();
  await expect(page.getByRole("region", { name: "Tu compra" })).toContainText("Diego López");
  await expect(adminLink).toHaveCount(0);
  await page.getByRole("link", { name: "Caja", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Caja", exact: true })).toBeVisible();
  await expect(adminLink).toHaveCount(0);
});

test("el cajero distingue homónimos solo por correo o número exactos y confirma la asociación", async ({ page }) => {
  await page.goto("/caja/miembros");
  await page.getByRole("button", { name: "Nuevo miembro" }).click();
  await page.getByLabel("Nombre", { exact: true }).fill("María García");
  await page.getByLabel("Correo electrónico").fill("otra.maria@example.com");
  await page.getByRole("button", { name: "Crear miembro de ejemplo" }).click();
  const search = page.getByRole("searchbox");
  for (const query of ["María García", "maria@example", "1727"]) {
    await search.fill(query);
    await expect(page.getByText("No se encontraron miembros.")).toBeVisible();
  }
  await search.fill(" OTRA.MARIA@EXAMPLE.COM ");
  const card = page.getByRole("region", { name: "Tarjeta seleccionada" });
  await expect(card).toContainText("01727");
  await expect(card).not.toContainText("otra.maria@example.com");
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
  await expect(page.getByRole("button", { name: "Confirmar venta simulada" })).toHaveCount(0);
  await page.getByRole("link", { name: "Abrir turno" }).click();
  await page.getByRole("button", { name: "Abrir nuevo turno" }).click();
  await page.getByLabel("Fondo inicial").fill("300");
  await page.getByRole("button", { name: "Abrir turno", exact: true }).click();
  await expect(page.getByRole("region", { name: "Efectivo esperado" })).toContainText("$300.00");
  await expect(page.getByText("Ventas registradas").locator("..")).toContainText("$0.00");
});

test("el ticket suma cantidades y calcula el cambio sin conservar la venta", async ({ page }) => {
  await page.goto("/caja/venta");
  const catalog = page.getByRole("region", { name: "¿Qué preparamos hoy?" });
  const ticket = page.getByRole("region", { name: "Tu compra" });
  await expect(ticket.getByRole("button", { name: "Vaciar ticket" })).toBeDisabled();
  await expect(ticket.getByRole("button", { name: "Cobrar $0.00" })).toBeDisabled();
  const width = page.viewportSize()!.width;
  const shortcut = page.getByRole("link", { name: "Ver compra" });
  if (width < 832) {
    await shortcut.click();
    await expect(ticket).toBeInViewport();
  }
  await expect(shortcut).toBeHidden();
  await catalog.getByRole("button", { name: /Añadir Latte, Chico/ }).click();
  await catalog.getByRole("button", { name: "Café", exact: true }).click();
  await expect(catalog.getByRole("button", { name: /Añadir Americano/ })).toBeVisible();
  await expect(catalog.getByRole("button", { name: /Añadir Chai/ })).toHaveCount(0);
  await catalog.getByRole("button", { name: "Bebidas", exact: true }).click();
  await expect(catalog.getByRole("button", { name: /Añadir Chai/ })).toBeVisible();
  await expect(catalog.getByRole("button", { name: /Añadir Latte/ })).toHaveCount(0);
  await catalog.getByRole("button", { name: "Alimentos", exact: true }).click();
  await expect(catalog.getByRole("button", { name: /Añadir Muffin/ })).toHaveCount(0);
  await catalog.getByRole("button", { name: "Postres", exact: true }).click();
  await expect(catalog.getByRole("button", { name: /Añadir Latte/ })).toHaveCount(0);
  await catalog.getByRole("button", { name: /Añadir Muffin/ }).click();

  const menuBox = (await catalog.boundingBox())!;
  const ticketBox = (await ticket.boundingBox())!;
  if (width < 832) {
    expect(ticketBox.y).toBeGreaterThanOrEqual(menuBox.y + menuBox.height);
  } else {
    expect(ticketBox.x).toBeGreaterThanOrEqual(menuBox.x + menuBox.width);
  }
  await ticket.getByRole("button", { name: /Añadir una unidad de Latte/ }).click();
  const pay = ticket.getByRole("link", { name: "Cobrar $172.00" });
  if (width >= 832) await expect(pay).toBeInViewport({ ratio: 1 });
  await pay.focus();
  await page.keyboard.press("Enter");
  await expect(ticket.getByLabel("Efectivo recibido")).toBeFocused();
  await ticket.getByLabel("Efectivo recibido").fill("200");
  await expect(ticket.getByText("Cambio: $28.00")).toBeVisible();
  await ticket.getByLabel("Mixto").check();
  await ticket.getByLabel("Parte en efectivo").fill("100");
  await expect(ticket.getByText("Parte en tarjeta: $72.00")).toBeVisible();
  await ticket.getByRole("button", { name: /Quitar una unidad de Muffin/ }).click();
  await expect(ticket.getByText("Parte en tarjeta: $30.00")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.reload();
  await expect(ticket.getByText("Aquí empieza tu próxima compra.")).toBeVisible();
});

test("el resumen y las compras reflejan sus filtros solo hasta recargar", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 2, 12));
  await page.goto("/administrador");
  const summary = page.getByRole("region", { name: "Resumen de ventas" });
  const revenue = page.getByRole("region", { name: "Así van tus ventas" });
  const hours = page.getByRole("region", { name: "Tu momento más concurrido" });
  await expect(revenue.getByRole("button")).toHaveCount(4);
  await expect(revenue.getByRole("button", { pressed: true })).toHaveAccessibleName(/Semana 1 .*: \$675\.00/);
  await expect(revenue.getByRole("button", { name: /Semana 4 .*: \$0\.00/ })).toBeVisible();
  await expect(hours.getByRole("button")).toHaveCount(13);
  await expect(hours.getByRole("button").first()).toHaveAccessibleName("07:00–08:00: 0 tickets");
  await expect(hours.getByRole("button").last()).toHaveAccessibleName("19:00–20:00: 0 tickets");
  await expect(summary).toContainText("$402.00");
  const period = page.getByRole("combobox", { name: "Periodo", exact: true });
  await period.selectOption("yesterday");
  await expect(summary).toContainText("$273.00");
  await expect(summary).toContainText("$91.00");
  await expect(hours.getByRole("button", { pressed: true })).toHaveAccessibleName("17:00–18:00: 2 tickets");
  await expect(revenue.getByRole("button", { pressed: true })).toHaveAccessibleName(/Semana 1 .*: \$675\.00/);
  await period.selectOption("week");
  await expect(revenue.getByRole("button")).toHaveCount(4);
  await expect(hours.getByRole("button", { pressed: true })).toHaveAccessibleName("12:00–13:00: 4 tickets");
  await period.selectOption("month");
  await expect(revenue.getByRole("button")).toHaveCount(4);
  await expect(revenue.getByRole("button", { pressed: true })).toHaveAccessibleName(/Semana 1 .*: \$675\.00/);
  await revenue.getByRole("button", { name: /Semana 2 .*: \$0\.00/ }).press("Enter");
  await expect(revenue.getByRole("button", { pressed: true })).toHaveAccessibleName(/Semana 2/);
  await expect(page.getByText("Leche entera")).toBeVisible();
  await expect(page.getByText("Vasos de 12 oz")).toBeHidden();
  await page.getByLabel("Solo insumos por reponer").uncheck();
  await expect(page.getByText("Vasos de 12 oz")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.reload();
  await expect(summary).toContainText("$402.00");
  await expect(page.getByText("Vasos de 12 oz")).toBeHidden();
});
