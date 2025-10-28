import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type of session state

const SessionContext = createContext<{
  signIn: (user: any) => void;
  signOut: () => void;
  session?: string | null;
  setSession: (session: any | null) => void;
  isLoading: boolean;
}>({
  signIn: (user: any) => null,
  signOut: () => null,
  session: null,
  setSession: (session: any | null) => {
    session 
  },
  isLoading: false,
});

// Provider component to wrap around your app
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use session context
export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
