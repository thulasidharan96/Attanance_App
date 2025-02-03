import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { AttendanceApi, UserApi } from "../service/Api";

const COMPANY_LAT = 8.79288;
const COMPANY_LON = 78.12069;
const LOCATION_RADIUS = 1000;

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

const Notification = ({ message, type }) => (
  <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`}>
    {message}
  </div>
);

const UserTable = ({ users = [] }) => (
  <div className="overflow-y-auto shadow-xl rounded-lg bg-white p-2" style={{ maxHeight: "400px" }}>
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white sticky top-0">
        <tr>
          <th className="border px-6 py-3 text-left">Date</th>
          <th className="border px-6 py-3 text-left">Attendance Status</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
              <td className="border px-4 py-3 font-bold">{user.dateOnly}</td>
              <td className="border px-4 py-3">
                <span className={`font-bold ${
                  user.attendanceStatus === "present" ? "text-green-600" :
                  user.attendanceStatus === "late" ? "text-yellow-500" :
                  user.attendanceStatus === "Absent" ? "text-red-600" : "text-gray-600"
                }`}>
                  {user.attendanceStatus}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="text-center py-4 text-gray-600">
              No attendance data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const DashBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWithinLocation, setIsWithinLocation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");
  const [registerNumber, setRegisterNumber] = useState(localStorage.getItem("RegisterNumber") || "");

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserApi(userId);
      setUsers(response.data);
    } catch (error) {
      showNotification("Failed to fetch attendance data", "error");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleClick = async () => {
    setProcessing(true);
    try {
      const response = await AttendanceApi();
      if (response.status === 201) {
        showNotification("Attendance marked successfully!", "success");
        fetchUsers();
      }
    } catch (error) {
      showNotification("Failed to mark attendance", "error");
      console.error("Error marking attendance:", error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const distance = getDistance(
            position.coords.latitude,
            position.coords.longitude,
            COMPANY_LAT,
            COMPANY_LON
          );
          setIsWithinLocation(distance < LOCATION_RADIUS);
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-400">
      {notification && <Notification {...notification} />}
      <Header />
      <main className="flex-grow flex flex-col">
        <section className="flex-grow flex justify-center items-center p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-semibold text-indigo-700">Dashboard</h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>

            <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold text-gray-700">Name:</div>
                <div className="text-gray-800">{userName}</div>
                <div className="font-semibold text-gray-700">Register Number:</div>
                <div className="text-gray-800">{registerNumber}</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <UserTable users={users} />
            )}

            <div className="flex justify-between mt-6">
              {isWithinLocation ? (
                <button
                  onClick={handleClick}
                  disabled={processing}
                  className={`px-4 py-3 text-white rounded-lg shadow-lg transition-colors ${
                    processing ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {processing ? "Processing..." : "Take Attendance"}
                </button>
              ) : (
                <p className="text-red-600 font-semibold">
                  You must be within the designated location to mark attendance.
                </p>
              )}

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Syncing..." : "Sync Data"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DashBoard;
