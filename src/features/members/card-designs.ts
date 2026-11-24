export const defaultCardDesign = { id: "polar-gift", name: "Regalo polar", background: "#1D5951", foreground: "#FFF3DF" } as const;

export const cardDesigns = [
  { id: "snow-village", name: "Villa nevada", background: "#98A18E", foreground: "#21362B" },
  { id: "thread-pine", name: "Pino de hilo", background: "#294B3C", foreground: "#FFF2DA" },
  { id: "bear-lights", name: "Osito de luces", background: "#EDBEB2", foreground: "#502C29" },
  defaultCardDesign,
  { id: "snow-santa", name: "Santa en nieve", background: "#B8D7DB", foreground: "#243C3D" },
  { id: "gingerbread", name: "Jengibre", background: "#EEE5D2", foreground: "#51342A" },
] as const;

export type CardDesign = (typeof cardDesigns)[number];
