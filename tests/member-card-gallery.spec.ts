import { expect, test } from "@playwright/test";

test("la tarjeta permite ampliar y cerrar el QR sin cambiar de página", async ({ page }) => {
  await page.goto("/mi-tarjeta");
  await expect(page.getByRole("article", { name: "Tarjeta de muestra: Regalo polar" })).toContainText("01725");
  await expect(page.getByRole("radio")).toHaveCount(0);
  const trigger = page.getByRole("button", { name: "Mostrar mi QR" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Mi QR" });
  await expect(dialog.getByRole("img", { name: "QR ampliado de muestra" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/\/mi-tarjeta$/);
});

test("guardar aplica el diseño, cancelar lo conserva y recargar restablece la muestra", async ({ page }) => {
  await page.goto("/mi-tarjeta/disenos");
  await expect(page.getByRole("radio")).toHaveCount(6);
  const initial = page.getByRole("radio", { name: "Regalo polar" });
  await expect(initial).toBeChecked();
  await initial.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Santa en nieve" })).toBeChecked();
  await page.getByRole("button", { name: "Guardar diseño" }).click();
  const saved = page.getByRole("article", { name: "Tarjeta de muestra: Santa en nieve" });
  await expect(saved).toBeVisible();
  await page.getByRole("link", { name: "Elegir diseño" }).click();
  await expect(page.getByRole("radio", { name: "Santa en nieve" })).toBeChecked();
  await page.getByText("Jengibre", { exact: true }).click();
  await expect(page.getByRole("radio", { name: "Jengibre" })).toBeChecked();
  await page.getByRole("link", { name: "Volver sin guardar" }).click();
  await expect(saved).toBeVisible();
  await page.reload();
  await expect(page.getByRole("article", { name: "Tarjeta de muestra: Regalo polar" })).toBeVisible();
});
