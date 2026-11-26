import { expect, test } from "@playwright/test";

test("el precio editado pasa a caja, se conserva en la venta y se restablece al recargar", async ({ page }) => {
  await page.goto("/administrador/menu");
  await page.getByRole("link", { name: "Editar Latte", exact: true }).click();
  await page.getByLabel("Precio en MXN").first().fill("72.50");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await page.getByRole("link", { name: "Abrir punto de venta" }).click();
  await page.getByRole("button", { name: "Añadir Latte, Chico · 12 oz, $72.50" }).click();
  await page.getByLabel("Efectivo recibido").fill("80");
  await page.getByRole("button", { name: "Confirmar venta simulada" }).click();
  await expect(page.getByRole("region", { name: "Resumen de cobro" })).toContainText("0059 confirmada");
  await page.goBack();
  await page.getByRole("link", { name: "Editar Latte", exact: true }).click();
  await page.getByLabel("Precio en MXN").first().fill("90");
  await page.getByLabel("Visible en el menú de caja").uncheck();
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await page.getByRole("link", { name: "Vista de caja" }).click();
  await expect(page.getByRole("button", { name: /Añadir Latte,/ })).toHaveCount(0);
  await page.getByRole("link", { name: "Volver al resumen de administración" }).click();
  await expect(page.getByRole("region", { name: "Resumen de ventas" })).toContainText("$474.50");
  await page.getByText("Detalle del ticket 0059").click();
  await expect(page.getByText("1 × Latte · Chico · 12 oz · $72.50 c/u")).toBeVisible();
  await page.getByRole("link", { name: "Abrir punto de venta" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Añadir Latte, Chico · 12 oz, $65.00" })).toBeVisible();
});

test("un conteo en el mínimo abre un aviso y reponer el insumo lo resuelve", async ({ page }) => {
  await page.goto("/administrador/existencias");
  await page.getByRole("button", { name: "Registrar movimiento" }).click();
  await page.getByRole("combobox", { name: "Insumo", exact: true }).selectOption("smallCup");
  await page.getByRole("combobox", { name: "Movimiento", exact: true }).selectOption("Conteo");
  await page.getByLabel("Existencia contada").fill("50");
  await page.getByLabel("Motivo").fill("Conteo del turno");
  await page.getByRole("button", { name: "Aplicar movimiento" }).click();
  await page.getByRole("link", { name: /Avisos/ }).click();
  const alert = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Vasos de 12 oz" }) });
  await expect(alert).toHaveCount(1);
  await alert.getByRole("link", { name: "Registrar reposición" }).click();
  await page.getByLabel("Cantidad (pzas.)").fill("1");
  await page.getByLabel("Motivo").fill("Reposición");
  await page.getByRole("button", { name: "Aplicar movimiento" }).click();
  await page.getByRole("link", { name: /Avisos/ }).click();
  await expect(alert).toHaveCount(0);
  await page.getByRole("link", { name: "Abrir punto de venta" }).click();
  await page.getByRole("link", { name: "Caja", exact: true }).click();
  await expect(page.getByText("51 pzas.")).toBeVisible();
});

test("crear una presentación la publica en caja; cancelar una edición conserva el nombre", async ({ page }) => {
  await page.goto("/administrador/menu/nuevo");
  await page.getByLabel("Nombre del producto").fill("Té helado");
  await page.getByRole("combobox", { name: "Categoría", exact: true }).selectOption("Bebidas");
  await page.getByLabel("Nombre de presentación").fill("Regular");
  await page.getByLabel("Precio en MXN").fill("35");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await page.getByRole("link", { name: "Editar Té helado" }).click();
  await page.getByLabel("Nombre del producto").fill("Borrador");
  await page.getByRole("link", { name: "Cancelar" }).click();
  await page.getByRole("link", { name: "Vista de caja" }).click();
  await page.getByRole("button", { name: "Bebidas", exact: true }).click();
  await expect(page.getByRole("button", { name: "Añadir Té helado, Regular, $35.00" })).toBeVisible();
});
