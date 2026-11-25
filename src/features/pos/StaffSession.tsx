import { createContext, useContext, useReducer } from "react";
import { Outlet } from "react-router";
import { initialState, sessionReducer } from "./session";

function useSessionState() {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  return { state, dispatch };
}
const StaffContext = createContext<ReturnType<typeof useSessionState> | null>(null);

export function StaffSession() {
  const session = useSessionState();
  return <StaffContext.Provider value={session}><Outlet /></StaffContext.Provider>;
}

export function useStaffSession() {
  const session = useContext(StaffContext);
  if (!session) throw new Error("StaffSession is required");
  return session;
}

export function currentTime() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}
