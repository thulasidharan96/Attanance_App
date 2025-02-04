import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { CurrentAttendanceByDate } from "../service/Api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");

  // Fetch attendance data from API
  const fetchAttendanceData = async () => {
    try {
      const response = await CurrentAttendanceByDate();
      // Access the studentAttendance array from the response
      const data = response.data.studentAttendance;
      
      if (Array.isArray(data)) {
        setAttendanceData(data);
      } else {
        console.warn("Student attendance data is not an array:", data);
        setAttendanceData([]);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceData([]);
    }
  };
  
  useEffect(() => {
    fetchAttendanceData();
  }, []); // Empty dependency array to ensure it only runs once when the component mounts

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const filterButtonStyle = "px-6 py-2 rounded-lg transition-colors text-white";
  const tabButtonStyle = "px-6 py-3 rounded-lg font-medium transition-all";

  // Helper function to get attendance stats
  const getAttendanceStats = () => {
    // Initialize counters for present and absent students
    let presentCount = 0;
    let absentCount = 0;

    // Loop through attendance data to count present and absent students
    attendanceData.forEach((item) => {
      if (item.attendanceStatus === "present") {
        presentCount++;
      } else if (item.attendanceStatus === "absent") {
        absentCount++;
      }
    });

    // Total students count is the length of the attendanceData array
    const totalStudents = attendanceData.length;

    return { totalStudents, presentCount, absentCount };
  };

  const { totalStudents, presentCount, absentCount } = getAttendanceStats();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <button
              onClick={() => logout()}
              className={`${filterButtonStyle} bg-red-500 hover:bg-red-600`}
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-8">
            {["attendance", "reports", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${tabButtonStyle} ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "attendance" && (
            <div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-md hover:shadow-lg"
                onClick={fetchAttendanceData}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>

              {/* Attendance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: "Total Students",
                    value: totalStudents,
                    color: "bg-blue-500",
                  },
                  {
                    title: "Present Today",
                    value: presentCount,
                    color: "bg-green-500",
                  },
                  {
                    title: "Absent Today",
                    value: absentCount,
                    color: "bg-red-500",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 border-t-4 border-b-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </h3>
                    <p
                      className={`text-2xl font-bold mt-2 ${stat.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Attendance Records</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Name", "Reg No", "Department", "Date", "Status"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {item.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.dateOnly}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.attendanceStatus === "present"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.attendanceStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              {/* Report Generation */}
              <h2 className="text-2xl font-semibold mb-4">Generate Reports</h2>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                {/* Report generation form here */}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              {/* Settings Section */}
              <h2 className="text-2xl font-semibold mb-4">Settings</h2>
              {/* Add your settings options here */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
