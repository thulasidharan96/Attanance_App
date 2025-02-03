export const storeUserData = (token)=>{
    localStorage.setItem('authToken',token)
}

export const storeUserId = (userId)=>{
    localStorage.setItem('userId',userId)
}

export const getUserId = ()=>{
    return localStorage.getItem('userId');
}

export const getUserData = ()=>{
    return localStorage.getItem('authToken');
}

export const removeUserData = ()=>{
     localStorage.removeItem('authToken')
     localStorage.removeItem('userId')
}