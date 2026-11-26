import { expect, test } from "@playwright/test";

test("el cumpleaños admite el 29 de febrero sin solicitar año", async ({ page }) => {
  await page.goto("/registro-miembros");
  await page.getByLabel("Nombre", { exact: true }).fill("Nora");
  await page.getByLabel("Correo electrónico").fill("nora@example.com");
  const month = page.getByRole("combobox", { name: "Mes", exact: true });
  const day = page.getByRole("combobox", { name: "Día", exact: true });
  await month.selectOption("2");
  await expect(day.getByRole("option", { name: "30", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Registrarse" }).click();
  await expect(day).toBeFocused();
  await day.selectOption("29");
  await page.getByRole("button", { name: "Registrarse" }).click();
  await page.getByRole("link", { name: "Volver al registro de miembros" }).click();
  await expect(month).toHaveValue("2");
  await expect(day).toHaveValue("29");
});

test("el registro valida los campos y personaliza la tarjeta solo hasta recargar", async ({ page }) => {
  await page.goto("/registro-miembros");
  const name = page.getByLabel("Nombre", { exact: true });
  const email = page.getByLabel("Correo electrónico");
  const submit = page.getByRole("button", { name: "Registrarse" });
  await name.fill("   ");
  await email.fill("maria@example.com");
  await submit.click();
  await expect(name).toBeFocused();
  await name.fill(" María   Díaz ");
  await email.fill("correo-incompleto");
  await submit.click();
  await expect(email).toBeFocused();
  await email.fill("maria@example.com");
  await submit.click();
  const greeting = page.getByRole("heading", { name: "Hola, María." });
  await expect(greeting).toBeVisible();
  await expect(page.getByText("MD", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toContainText("María Díaz");
  await expect(page.getByRole("main")).not.toContainText("maria@example.com");
  await page.getByRole("link", { name: "Elegir diseño" }).click();
  await page.getByText("Jengibre", { exact: true }).click();
  await page.getByRole("button", { name: "Guardar diseño" }).click();
  await expect(page.getByRole("article", { name: /Jengibre/ })).toContainText("María Díaz");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Hola, Miembro." })).toBeVisible();
  await expect(page.getByRole("article")).toContainText("Miembro de ejemplo");
});
