import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { AttendanceApi, UserApi } from "../service/Api";
import {
  ArrowPathIcon,
  UserCircleIcon,
  TableCellsIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

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
  <div
    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-xl shadow-2xl z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white text-lg font-medium animate-fade-in`}
  >
    {message}
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
  const [userName] = useState(localStorage.getItem("name") || "");
  const [registerNumber] = useState(localStorage.getItem("RegisterNumber") || "");

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
      const attendanceStatus = isWithinLocation ? 'present' : 'leave';
      const response = await AttendanceApi({ attendanceStatus });
      
      if (response) {
        const statusMessage = isWithinLocation
          ? "Present marked successfully!"
          : "Absent marked successfully!";
        showNotification(statusMessage, "success");
        await fetchUsers();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {notification && <Notification {...notification} />}
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-cyan-600" />
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your attendance and view history
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span>Logout</span>
              <ArrowPathIcon className="w-4 h-4 transform rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-cyan-600" />
                Student Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-800">{userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Register Number:</span>
                  <span className="text-gray-800">{registerNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-cyan-600" />
                Location Status
              </h2>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-4 py-2 rounded-lg ${
                  isWithinLocation 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isWithinLocation ? (
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 mr-2" />
                  )}
                  {isWithinLocation ? 'Within Campus Range' : 'Outside Campus Range'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-cyan-600" />
                Attendance History
              </h2>
            </div>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-cyan-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.dateOnly}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.attendanceStatus === "present"
                                ? "bg-green-100 text-green-800"
                                : user.attendanceStatus === "late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {user.attendanceStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <button
              onClick={handleClick}
              disabled={processing}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium shadow-md transition-all ${
                isWithinLocation
                  ? processing
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                  : processing
                    ? "bg-gray-400"
                    : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {processing ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
              {processing ? "Processing..." : "Mark Attendance"}
            </button>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md transition-all"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Syncing..." : "Sync Data"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashBoard;
