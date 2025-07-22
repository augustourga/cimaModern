import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext({
  user: { name: 'Usuario', career: 'Sin datos' },
  setUser: (u: any) => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; career: string }>({ name: 'Usuario', career: 'Sin datos' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; 