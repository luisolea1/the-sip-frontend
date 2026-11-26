import type { Birthday } from "@/features/members/components/BirthdayFields";

export type PosMember = { number: string; name: string; email: string; stamps: number; birthday?: Birthday };

export const sampleMembers: PosMember[] = [
  { number: "01725", name: "María García", email: "maria@example.com", stamps: 8 },
  { number: "01726", name: "Diego López", email: "diego@example.com", stamps: 3 },
];

export function searchMembers(members: PosMember[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return members;
  return members.filter(member => member.number === query || member.email.toLowerCase() === query);
}
