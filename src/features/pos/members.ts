export type PosMember = { number: string; name: string; email: string; stamps: number };

export const sampleMembers: PosMember[] = [
  { number: "01725", name: "María García", email: "maria@example.com", stamps: 8 },
  { number: "01726", name: "Diego López", email: "diego@example.com", stamps: 3 },
];

export function searchText(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").trim().toLocaleLowerCase("es");
}
