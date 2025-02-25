import axios from "axios";
import moment from "moment-timezone";

const LOGIN_URL = "https://rest-api-hp0n.onrender.com/user/login";

// Login API
export const LoginApi = async (data) => {
  return await axios.post(LOGIN_URL, data);
};

const REGISTER_URL = "https://rest-api-hp0n.onrender.com/user/signup";

// Register API
export const RegisterApi = async (data) => {
  return await axios.post(REGISTER_URL, data);
};

// get attendance status API by userId
export const UserApi = async (userIdd) => {
  const USER_URL = `https://rest-api-hp0n.onrender.com/attendance/${userIdd}`;
  const token = localStorage.getItem("authToken");
  return await axios.get(USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// AttendanceTake API
export const AttendanceApi = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const department = localStorage.getItem("department");
    const registerNumber = localStorage.getItem("RegisterNumber");
    const ATTENDANCE_URL = "https://rest-api-hp0n.onrender.com/attendance/";

    if (!token) throw new Error("Authentication token missing");
    if (!userId) throw new Error("User ID missing");

    const attendanceData = {
      userId: userId,
      name: name,
      registrationNumber: registerNumber,
      dateOnly: moment.tz(new Date(), "Asia/Kolkata").format("YYYY-MM-DD"),
      attendanceStatus: data.attendanceStatus,
      department: department,
    };

    const response = await axios.post(ATTENDANCE_URL, attendanceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

// All Student Attendance API by curent  date
export const CurrentAttendanceByDate = async () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const CURRENT_ATTENDANCE_URL = "https://rest-api-hp0n.onrender.com/admin";

  // Validate that both userId and token are available
  if (!token) throw new Error("Authentication token missing");
  if (!userId) throw new Error("User ID missing");

  try {
    const response = await axios.get(CURRENT_ATTENDANCE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response; // Return the full response, which will contain the data
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
};

//Student  Attendance by register number
export const studentbyRegisterNo = async (registrationNumber) => {
  const USER_URL = `https://rest-api-hp0n.onrender.com/admin/${registrationNumber}`;
  const token = localStorage.getItem("authToken");
  return await axios.get(USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Department Attendance Report API
export const getDepartmentReport = async (department) => {
  const USER_URL = `https://rest-api-hp0n.onrender.com/admin/department/${department}`;
  const token = localStorage.getItem("authToken");
  return await axios.get(USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Date Range Attendance Report API
export const allData = async () => {
  const USER_URL = `https://rest-api-hp0n.onrender.com/admin/all`;
  const token = localStorage.getItem("authToken");
  return await axios.get(USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Search User by UserId API
export const searchUserByUserId = async (userId) => {
  const API_URL = "https://rest-api-hp0n.onrender.com/admin/";
  const token = localStorage.getItem("authToken");
  return await axios.get(`${API_URL}/search/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Get User Messages API by UserId
export const getUserMessages = async () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("Missing authentication token or userId");
  }

  try {
    const response = await axios.get(
      `https://rest-api-hp0n.onrender.com/attendance/message/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

//post user message
export const postUserMessage = async (message, clientId) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  try {
    const response = await axios.post(
      `https://rest-api-hp0n.onrender.com/admin/message`,
      {
        userId: clientId,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

//delete user by userid
export const userDelete = async (userId) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Missing authentication token");
  }

  try {
    const response = await axios.delete(
      `https://rest-api-hp0n.onrender.com/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

// Leave Request
export const LeaveRequest = async (data) => {
  const token = localStorage.getItem("authToken");
  const RegisterNumber = localStorage.getItem("RegisterNumber");

  if (!token) {
    throw new Error("Missing authentication token");
  }
  try {
    const response = await axios.post(
      `https://rest-api-hp0n.onrender.com/user/leave`,
      {
        StartDate: data.startDate,
        EndDate: data.endDate,
        RegisterNumber: RegisterNumber,
        Reason: data.reason,
        userId: data.userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

//Get Recent Leave Status
export const getRecentLeaveStatus = async (userId) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  try {
    const response = await axios.get(
      `https://rest-api-hp0n.onrender.com/attendance/leave/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

// Get Pending Leave Requests of all Users
export const getAllPendingLeaveRequests = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  try {
    const response = await axios.get(
      `https://rest-api-hp0n.onrender.com/admin/leave/pending`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle known HTTP errors
      console.error(`Error (${error.response.status}): ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response from server
      console.error("Network error:", error.request);
    } else {
      // Handle other errors (axios setup, etc.)
      console.error("Unexpected error:", error.message);
    }
    throw error;
  }
};

// Approve or Reject Leave Request
export const updateLeaveRequest = async (id, status) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  try {
    const response = await axios.patch(
      `https://rest-api-hp0n.onrender.com/admin/leave/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating leave request:", error);

    if (error.response) {
      // Server responded with an error status
      throw new Error(
        error.response.data.error || "Failed to update leave request."
      );
    } else {
      // Network error or request was not completed
      throw new Error("Network error. Please try again later.");
    }
  }
};
