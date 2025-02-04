import axios from 'axios';
import moment from 'moment-timezone';

const LOGIN_URL = 'http://localhost:3000/user/login';

// Login API

export const LoginApi = async (data) => {
    return await axios.post(LOGIN_URL, data);
};

const REGISTER_URL = 'http://localhost:3000/user/signup';

// Register API
export const RegisterApi = async (data) => {
    return await axios.post(REGISTER_URL, data);
};

// get attendance status API by userId
export const UserApi = async (userIdd) => {
    const USER_URL = `http://localhost:3000/attendance/${userIdd}`;
    const token = localStorage.getItem('authToken');
    return await axios.get(USER_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// AttendanceTake API
export const AttendanceApi = async (data) => {
  try {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const department = localStorage.getItem('department');
    const registerNumber = localStorage.getItem('RegisterNumber');
    const ATTENDANCE_URL = 'http://localhost:3000/attendance/';

    if (!token) throw new Error("Authentication token missing");
    if (!userId) throw new Error("User ID missing");

    const attendanceData = {
      userId: userId,
      name: name,
      registrationNumber: registerNumber,
      dateOnly: moment.tz(new Date(), "Asia/Kolkata").format('YYYY-MM-DD'),
      attendanceStatus: data.attendanceStatus,
      department: department,
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
      console.error("API Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};


// All Student Attendance API
export const CurrentAttendanceByDate = async () => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const CURRENT_ATTENDANCE_URL = 'http://localhost:3000/admin';

  // Validate that both userId and token are available
  if (!token) throw new Error("Authentication token missing");
  if (!userId) throw new Error("User ID missing");

  try {
      const response = await axios.get(CURRENT_ATTENDANCE_URL, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
      });
      return response;  // Return the full response, which will contain the data
  } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
  }
};

// All Student Attendance API

//Student  Attendance by register number
export const studentbyRegisterNo = async (registrationNumber) => {
  const USER_URL = `http://localhost:3000/admin/${registrationNumber}`;
  const token = localStorage.getItem('authToken');
  return await axios.get(USER_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};


export const getDepartmentReport = async (department) => {
  console.log("Fetching department report for:", department);
};

export const getDateRangeReport = async (startDate, endDate) => {
  console.log("Fetching date range report for:", startDate, "to", endDate);
};
  
