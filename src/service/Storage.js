export const storeUserData = (token)=>{
    localStorage.setItem('authToken',token)
}

export const storeUserId = (userId)=>{
    localStorage.setItem('userId',userId)
}

export const storeUserName = (name) => {
    localStorage.setItem('name', name);
};

export const storeRegisterNumber = (RegisterNumber) => {
    localStorage.setItem('RegisterNumber', RegisterNumber);
};

export const storeDepartment = (department) => {
    localStorage.setItem('department', department);
};

export const getUserName = () => {
    return localStorage.getItem('name');
};

export const getRegisterNumber = () => {
    return localStorage.getItem('RegisterNumber');
};

export const getUserId = ()=>{
    return localStorage.getItem('userId');
}

export const getUserData = ()=>{
    return localStorage.getItem('authToken');
}

export const removeUserData = () => {
    localStorage.clear();
    //localStorage.removeItem('authToken');
    //localStorage.removeItem('userId');
    // Or use localStorage.clear() to remove all items
  }
  