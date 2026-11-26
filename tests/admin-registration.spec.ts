import { expect, test } from "@playwright/test";

test("probar el registro de administrador limpia los campos sin enviar credenciales", async ({ page }) => {
  await page.goto("/administrador/registro");
  const email = page.getByLabel("Correo electrónico");
  const password = page.getByLabel("Contraseña");
  const submit = page.getByRole("button", { name: "Probar registro" });
  await email.fill("invalido");
  await submit.click();
  await expect(email).toBeFocused();
  await email.fill("admin@example.com");
  await password.fill("solo-para-pruebas");
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url()));
  await submit.click();
  await expect(page.getByRole("status")).toContainText("No se ha creado ninguna cuenta");
  await expect(email).toHaveValue("");
  await expect(password).toHaveValue("");
  await expect(page).toHaveURL(/\/administrador\/registro$/);
  expect(requests).toEqual([]);
});
