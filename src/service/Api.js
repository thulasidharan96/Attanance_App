import axios from 'axios';
const userId = localStorage.getItem('userId');

const LOGIN_URL = 'http://localhost:3000/user/login';

export const LoginApi = async (data) => {
    return await axios.post(LOGIN_URL, data);
};

const REGISTER_URL = 'http://localhost:3000/user/signup';

export const RegisterApi = async (data) => {
    return await axios.post(REGISTER_URL, data);
};

const ATTENDANCE_URL = 'http://localhost:3000/attendance/';

export const AttendanceApi = async (data) => {
    const token = localStorage.getItem('authToken');
    return await axios.post(ATTENDANCE_URL, data);
};

const USER_URL = `http://localhost:3000/attendance/${userId}`;
export const UserApi = async (data) => {
    const token = localStorage.getItem('authToken');
    return await axios.get(USER_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
