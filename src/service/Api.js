import axios from 'axios';

const LOGIN_URL = 'http://localhost:3000/user/login';

export const LoginApi = async (data) => {
    return await axios.post(LOGIN_URL, data);
};

const REGISTER_URL = 'http://localhost:3000/user/signup';

export const RegisterApi = async (data) => {
    return await axios.post(REGISTER_URL, data);
};