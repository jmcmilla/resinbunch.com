import { createContext, useContext } from 'react';

export const AdminContext = createContext();

export function useAuth() {
  return useContext(AdminContext);
}
