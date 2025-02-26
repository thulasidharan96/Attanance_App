import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  isAuthenticated,
  logout,
  isAdminAuthentication,
} from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import AnnouncementModal from "../component/AnnouncementModal";
import LeaveForm from "../component/LeaveForm";
import LeaveStatus from "../component/LeaveStatus";
import {
  AttendanceApi,
  UserApi,
  getUserMessages,
  getAnnouncement,
} from "../service/Api";
import {
  ArrowPathIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const COMPANY_LAT = 8.79288;
const COMPANY_LON = 78.12069;
const LOCATION_RADIUS = 1000;
const TIMEOUT = 5000;

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
    className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl shadow-lg z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white text-sm md:text-lg font-medium animate-fade-in`}
  >
    {message}
  </div>
);

const NotificationCard = ({ notifications, onClose }) => (
  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
    <div className="bg-gray-800 p-4 rounded-t-2xl shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Notifications
        </h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
    {notifications.length === 0 ? (
      <div className="p-4 text-center bg-gray-500">
        <p className="text-white font-semibold">No notifications yet.</p>
      </div>
    ) : (
      <ul className="bg-gray-500 divide-y divide-gray-200">
        {notifications.map((notification, index) => (
          <li
            key={index}
            className="px-4 py-4 hover:bg-gray-900 transition-all duration-300 rounded-lg border-t border-gray-200 flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="text-white font-bold">{notification.message}</p>
            </div>
            <p className="text-xs md:text-sm text-gray-100 ml-4">
              {notification.time}
            </p>
          </li>
        ))}
      </ul>
    )}
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
  const [registerNumber] = useState(
    localStorage.getItem("RegisterNumber") || ""
  );
  const [department] = useState(localStorage.getItem("department") || "");
  const [showNotificationCard, setShowNotificationCard] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [attendanceUpdated, setAttendanceUpdated] = useState(false);
  const notificationTimeout = useRef(null);

  const [announcement, setAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });

    clearTimeout(notificationTimeout.current);

    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (isAuthenticated()) {
        console.log("User is authenticated");
        try {
          const response = await getAnnouncement();

          // Validate response structure before accessing data
          if (
            response?.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const { title, message } = response.data[0]; // Get first announcement
            console.log(`Title: ${title}`);
            console.log(`Message: ${message}`);

            setAnnouncement({ title, message });
            setShowModal(true); // Show modal only if there's an announcement
          } else {
            console.log("No announcements available.");
            setAnnouncement(null); // Reset announcement if none found
            setShowModal(false);
          }
        } catch (error) {
          console.error("Failed to fetch announcements:", error);
          setAnnouncement(null); // Prevent lingering old announcements
          setShowModal(false);
        }
      } else {
        console.log("User is not authenticated");
      }
    };

    fetchAnnouncements();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const source = axios.CancelToken.source();
      setTimeout(() => {
        source.cancel("Timeout exceeded");
      }, TIMEOUT);

      const response = await UserApi(userId, { cancelToken: source.token });
      setUsers(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        showNotification("Request timed out", "error");
      } else {
        showNotification("Failed to fetch attendance data", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId, fetchUsers, attendanceUpdated]);

  const handleClick = async () => {
    setProcessing(true);
    try {
      const attendanceStatus = isWithinLocation ? "present" : "absent";
      const source = axios.CancelToken.source();
      setTimeout(() => {
        source.cancel("Timeout exceeded");
      }, TIMEOUT);

      const response = await AttendanceApi(
        { attendanceStatus },
        { cancelToken: source.token }
      );
      if (response) {
        const statusMessage = isWithinLocation
          ? "Present marked successfully!"
          : "Absent marked successfully!";
        console.log(statusMessage);
        showNotification(
          statusMessage,
          statusMessage === "Present marked successfully!" ? "success" : "error"
        );
        setAttendanceUpdated((prev) => !prev);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        showNotification("Request timed out", "error");
      } else {
        showNotification("Already Attendance Marked ", "error");
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
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
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleNotificationCard = useCallback(async () => {
    setShowNotificationCard((prev) => !prev);

    if (!showNotificationCard) {
      try {
        const messages = await getUserMessages();

        if (Array.isArray(messages)) {
          const newNotifications = messages.map((message) => ({
            id: message._id,
            message: message.message,
            time: new Date(message.date).toISOString().split("T")[0],
          }));
          setNotifications(newNotifications);
          setTimeout(() => {
            setShowNotificationCard(false);
          }, 6000);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          showNotification("Request timed out", "error");
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.message ===
            "No valid entry found for provided userId"
        ) {
          showNotification("No valid entry found", "error");
        } else {
          console.error("Failed to fetch messages:", error);
          showNotification("Failed to fetch notifications", "error");
        }
        setNotifications([]);
      }
    }
  }, [showNotificationCard]);

  useEffect(() => {
    if (!showNotificationCard) {
      setNotifications([]);
    }
  }, [showNotificationCard]);

  if (!isAuthenticated() && isAdminAuthentication()) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {showModal && (
        <AnnouncementModal
          title={announcement?.title}
          message={announcement?.message}
          onClose={() => setShowModal(false)}
        />
      )}
      {notification && <Notification {...notification} />}
      <Header />
      <main className="flex-grow p-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Manage your attendance and view history
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleNotificationCard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 hover:bg-blue-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <BellIcon className="w-5 h-5" />
                <span className="hidden md:inline">Notifications</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <span className="hidden md:inline">Logout</span>
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className=" mb-4 justify-center align-center">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-center">
                <UserCircleIcon className="w-6 h-6 text-cyan-600" />
                Student Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-800">{userName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">
                    Register Number:
                  </span>
                  <span className="text-gray-800">{registerNumber}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="text-gray-800">{department}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-row justify-between items-stretch gap-4 mb-4 bg-gray-100 rounded-2xl">
            {/* Location Status */}
            <div className="flex flex-col justify-between h-full w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-4 gap-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
                <MapPinIcon className="w-4 h-4 text-cyan-600" />
                Location Status
              </h2>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    isWithinLocation
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isWithinLocation ? (
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 mr-2" />
                  )}
                  {isWithinLocation ? "Within Campus" : "Outside Campus"}
                </span>
              </div>
            </div>

            {/* Leave Form & Status */}
            <div className="flex flex-col justify-between h-full w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex flex-col md:flex-col justify-between w-full gap-2">
                <LeaveForm userId={userId} dept={department} />
                <LeaveStatus userId={userId} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200">
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.dateOnly}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-sm rounded-full ${
                                user.attendanceStatus === "present"
                                  ? "bg-green-400 text-green-900"
                                  : user.attendanceStatus === "absent"
                                  ? "bg-red-400 text-red-900"
                                  : "bg-gray-400 text-gray-900"
                              }`}
                            >
                              {user.attendanceStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 py-2 text-center text-sm text-gray-500"
                        >
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
              } text-white w-full md:w-auto`}
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md transition-all w-full md:w-auto"
            >
              <ArrowPathIcon
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Syncing..." : "Sync Data"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      {showNotificationCard && (
        <NotificationCard
          notifications={notifications}
          onClose={toggleNotificationCard}
          userId={userId}
        />
      )}
    </div>
  );
};

export default DashBoard;
