export const packaging = {
  smallCup: { name: "Vasos de 12 oz", stock: 85, minimum: 50 },
  largeCup: { name: "Vasos de 16 oz", stock: 60, minimum: 30 },
  tray: { name: "Charolas", stock: 36, minimum: 15 },
};

export type PackageId = keyof typeof packaging;
