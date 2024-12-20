"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface CustomUser {
  name: string;
  email: string;
  id?: string; // Make id optional if not always available
}

interface SessionProviderProps {
  user: CustomUser | null;
  session: Session | null;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps
);

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionProviderProps;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);
  return sessionContext;
};
