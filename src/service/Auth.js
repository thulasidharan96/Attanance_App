import { jwtDecode } from 'jwt-decode';
import { getUserData, removeUserData } from './Storage';

export const isAuthenticated = () => {
  const token = getUserData();
  
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      removeUserData();
      return false;
    }
    if (decoded.role !== 'user') {
      return false;
    }
    return true;
  } catch (error) {
    removeUserData();
    return false;
  }
};

export const isAuth = ()=>{
  return getUserData()!=null?true:false;
}

export const logout = () => {
  removeUserData();
  window.location.href = '/';
};

export const isAdminAuthentication = () => {
  const token = getUserData();
  
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      removeUserData();
      return false;
    }
    if (decoded.role !== 'admin') {
      return false;
    }
    return true;
  } catch (error) {
    removeUserData();
    return false;
  }
};
