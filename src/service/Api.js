import axios from 'axios';
const LOGIN_URL = 'http://localhost:3000/user/login';

export const LoginApi = async (data) => {
    return await axios.post(LOGIN_URL, data);
};

const REGISTER_URL = 'http://localhost:3000/user/signup';

export const RegisterApi = async (data) => {
    return await axios.post(REGISTER_URL, data);
};

export const UserApi = async (userIdd) => {
    const USER_URL = `http://localhost:3000/attendance/${userIdd}`;
    const token = localStorage.getItem('authToken');
    return await axios.get(USER_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};




export const AttendanceApi = async (data) => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const ATTENDANCE_URL = 'http://localhost:3000/attendance/';
    // Validate that both userId and token are available
    if (!token) throw new Error("Authentication token missing");
    if (!userId) throw new Error("User ID missing");

    // Ensure userId is included in the request data
    const attendanceData = {
      ...data,
      userId: userId
    };

    const response = await axios.post(ATTENDANCE_URL, attendanceData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Log API error responses for debugging
      console.error("API Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};
