// Authentication Functions
import { getUserData, removeUserData } from './Storage';

export const isAuthenticated = () => Boolean(getUserData());

export const logout = () => {
  removeUserData();
  // Optionally handle redirects or notifications upon logout.
};