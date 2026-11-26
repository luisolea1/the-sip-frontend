import { createContext, useContext, useState, type ReactNode } from "react";

import type { Birthday } from "./components/BirthdayFields";

type MemberProfile = { name: string; email: string; birthday?: Birthday };
type MemberProfileSession = {
  profile: MemberProfile | null;
  register: (profile: MemberProfile) => void;
};

const MemberProfileContext = createContext<MemberProfileSession | null>(null);

export function MemberProfileProvider({ children }: { children: ReactNode }) {
  const [profile, register] = useState<MemberProfile | null>(null);
  return (
    <MemberProfileContext.Provider value={{ profile, register }}>
      {children}
    </MemberProfileContext.Provider>
  );
}

export function useMemberProfile() {
  const session = useContext(MemberProfileContext);
  if (!session) throw new Error("MemberProfileProvider is required");
  return session;
}
