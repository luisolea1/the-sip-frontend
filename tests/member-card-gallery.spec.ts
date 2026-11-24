import { expect, test } from "@playwright/test";

test("la galería pública permite explorar los seis diseños sin conservar la selección", async ({ page }) => {
  await page.goto("/mi-tarjeta");
  const designs = ["Villa nevada", "Pino de hilo", "Osito de luces", "Regalo polar", "Santa en nieve", "Jengibre"];
  const picker = page.getByRole("group", { name: "Elige un diseño" });
  const initial = picker.getByRole("radio", { name: designs[0] });
  await expect(initial).toBeChecked();
  await initial.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("article", { name: designs[1] })).toBeVisible();

  for (const design of designs) {
    await picker.getByRole("radio", { name: design }).check();
    await expect(page.getByRole("article", { name: design }).getByText("De muestra", { exact: true })).toBeVisible();
  }
  await page.reload();
  await expect(initial).toBeChecked();
  await expect(page.getByRole("article", { name: designs[0] })).toBeVisible();
});
