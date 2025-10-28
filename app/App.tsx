import React from 'react';
import { SessionProvider } from './ctx';
import Layout from './_layout';

interface UserContextType {
  user: any;  // You can replace `any` with a more specific type for user
  setUser: (user: any) => void;
}

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export default function App() {
  const [user, setUser] = React.useState();
  return (
    <UserContext.Provider value={{user, setUser}}>
      <Layout> </Layout>
    </UserContext.Provider>
  );
}
