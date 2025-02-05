import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, logout, isAdminAuthentication } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import {
  CurrentAttendanceByDate,
  studentbyRegisterNo,
  getDepartmentReport,
  allData,
  searchUserByUserId,
} from "../service/Api";
import {
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  TableCellsIcon,
  UserCircleIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [activeTab, setActiveTab] = useState("attendance");
  const [reportTab, setReportTab] = useState("regNo");
  const [department, setDepartment] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [userId, setuserId] = useState("");
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (!isAdminAuthentication()) {
      return <Navigate to="/" />;
    }

  const handleLogout = () => logout();

  async function fetchAttendanceData() {
    setLoading(true);
    try {
      const response = await CurrentAttendanceByDate();
      const data = response.data.studentAttendance;
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (error) {
      // Extract error details
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      // Log error for debugging
      console.error("Attendance Data Fetch Error:", {
        statusCode,
        message: errorMessage,
        error,
      });

      // Handle specific error cases
      const errorResponses = {
        401: {
          message: "Your session has expired. Please log in again.",
          action: () => {
            setAttendanceData([]);
            logout();
          },
        },
        403: {
          message: "You do not have permission to access this data.",
          action: () => setAttendanceData([]),
        },
        404: {
          message: "No attendance records found for today.",
          action: () => setAttendanceData([]),
        },
        500: {
          message: "Server error occurred. Please try again later.",
          action: () => setAttendanceData([]),
        },
      };

      const errorHandler = errorResponses[statusCode] || {
        message: "Failed to fetch attendance data. Please try again.",
        action: () => setAttendanceData([]),
      };

      // Display error toast/notification
      alert(errorHandler.message);
      errorHandler.action();
    } finally {
      setLoading(false);
    }
  };

  const filterStoredData = () => {
    if (!previewData.length) return [];

    return previewData.filter((record) => {
      const recordDate = new Date(record.dateOnly);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      return recordDate >= startDate && recordDate <= endDate;
    });
  };

  const getAttendanceStats = () => {
    let presentCount = 0;
    let leaveCount = 0;

    attendanceData?.forEach((item) => {
      if (item.attendanceStatus === "present") presentCount++;
      else if (item.attendanceStatus === "leave") leaveCount++;
    });

    return { totalStudents: attendanceData.length, presentCount, leaveCount };
  };

  const handleSearch = async (type) => {
    if (type === "regNo" && !registerNumber) {
      alert("Please enter a register number");
      return;
    }
    if (type === "department" && !department) {
      alert("Please select a department");
      return;
    }
    if (type === "dateRange" && (!dateRange.start || !dateRange.end)) {
      alert("Please select both start and end dates");
      return;
    }

    setLoading(true);
    try {
      let response;
      switch (type) {
        case "regNo":
          response = await studentbyRegisterNo(registerNumber);
          break;
        case "department":
          response = await getDepartmentReport(department);
          break;
        default:
          throw new Error("Invalid search type");
      }
      setPreviewData(response.data.records || []);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Failed to fetch ${type} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAllData = async () => {
    setLoading(true);
    try {
      let response = await allData();
      setPreviewData(response.data.studentAttendance || []);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async () => {
    setLoading(true);
    try {
      const response = await searchUserByUserId(userId);
      // Access first item from array since response contains array with single user
      setFoundUser(response.data.records[0]);
      console.log("Found user:", response.data.records[0]);
    } catch (error) {
      alert("User not found");
      setFoundUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userId) => {
    try {
      // Implement your edit user logic here
      alert("Edit user functionality to be implemented");
    } catch (error) {
      alert("Failed to edit user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // Implement your delete user logic here

        alert("Delete user functionality to be implemented");
        setFoundUser(null);
        setuserId("");
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const renderPreviewTable = (data) => (
    <div className="bg-white rounded-2xl shadow-lg p-2 mt-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xl font-semibold">Today Attendance Report</h3>
        <button
          onClick={() => {
            const filename = `attendance_report_${
              new Date().toISOString().split("T")[0]
            }.csv`;
            const headers = "Date,Name,Register Number,Department,Status\n";
            const csvData = data
              .map(
                (item) =>
                  `${item.dateOnly},${item.name},${item.registrationNumber},${item.department},${item.attendanceStatus}`
              )
              .join("\n");

            const blob = new Blob([headers + csvData], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Reg No
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{item.dateOnly}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.registrationNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.department}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
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
  );
  const { totalStudents, presentCount, leaveCount } = getAttendanceStats();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 shadow-sm flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-cyan-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "attendance"
                  ? "Today's Attendance Overview"
                  : activeTab === "reports"
                  ? "Student Reports Management"
                  : "User Management"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl"
            >
              <span>Logout</span>
              <ArrowPathIcon className="w-4 h-4 transform rotate-180" />
            </button>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            {["attendance", "reports", "Setting"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "attendance" ? (
                  <TableCellsIcon className="w-5 h-5" />
                ) : (
                  <DocumentMagnifyingGlassIcon className="w-5 h-5" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Total Students",
                    value: totalStudents,
                    icon: UsersIcon,
                    color: "bg-blue-500",
                  },
                  {
                    title: "Present Today",
                    value: presentCount,
                    icon: CheckCircleIcon,
                    color: "bg-green-500",
                  },
                  {
                    title: "Leave Today",
                    value: leaveCount,
                    icon: XCircleIcon,
                    color: "bg-red-500",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl p-6 ${stat.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <stat.icon className="w-12 h-12 opacity-20" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="m-1 border-gray-200 flex justify-between items-center">
                <button
                  onClick={fetchAttendanceData}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors duration-200"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>
              {renderPreviewTable(attendanceData)}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-8">
              {/* Report Type Tabs */}
              <div className="flex justify-center space-x-4 mb-8">
                {[
                  {
                    id: "regNo",
                    label: "Register Number",
                    icon: UserCircleIcon,
                  },
                  {
                    id: "department",
                    label: "Department",
                    icon: AcademicCapIcon,
                  },
                  { id: "dateRange", label: "All Data", icon: ClockIcon },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setReportTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                      reportTab === tab.id
                        ? "bg-cyan-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Report Content */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {reportTab === "regNo" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">
                      Register Number Search
                    </h2>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        placeholder="Enter Register Number"
                        className="flex-1 px-4 py-2 border rounded-xl"
                      />
                      <button
                        onClick={() => handleSearch("regNo")}
                        className="px-6 py-2 bg-cyan-600 text-white rounded-xl"
                        disabled={loading}
                      >
                        {loading ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>
                )}
                {reportTab === "department" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Department Search</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-4 py-2 border rounded-xl"
                        >
                          <option value="">Select Department</option>
                          <option value="CSE">Computer Science</option>
                          <option value="ECE">Electronics</option>
                          <option value="MECH">Mechanical</option>
                          <option value="EEE">Electrical</option>
                        </select>
                        <button
                          onClick={() => {
                            // Reset date range when searching by department only
                            setDateRange({ start: "", end: "" });
                            handleSearch("department");
                          }}
                          className="mt-4 w-full px-6 py-2 bg-cyan-600 text-white rounded-xl disabled:opacity-50"
                          disabled={loading || !department}
                        >
                          {loading ? "Searching..." : "View All Records"}
                        </button>
                      </div>

                      <div className="w-full md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                start: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-xl"
                          />
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                end: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-xl"
                          />
                          <button
                            className="mt-4 w-full px-6 py-2 bg-cyan-600 text-white rounded-xl disabled:opacity-50"
                            onClick={() => {
                              if (
                                department &&
                                dateRange.start &&
                                dateRange.end
                              ) {
                                const filteredData = filterStoredData();
                                setPreviewData(filteredData);
                              } else {
                                alert(
                                  "Please select department and date range"
                                );
                              }
                            }}
                          >
                            {loading ? "Filtering..." : "Filter by Date Range"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {reportTab === "dateRange" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">All Attendance Data</h2>
                    <button
                      onClick={handleAllData}
                      className="px-6 py-2 bg-cyan-600 text-white rounded-xl"
                    >
                      All Data
                    </button>
                  </div>
                )}
                {searchPerformed &&
                  previewData.length > 0 &&
                  renderPreviewTable(previewData)}
              </div>
            </div>
          )}
          {activeTab === "Setting" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">User Management</h2>

                <div className="flex gap-4 mb-8">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setuserId(e.target.value)}
                    placeholder="Search user by Registration Number"
                    className="flex-1 px-4 py-2 border rounded-xl"
                  />
                  <button
                    onClick={handleUserSearch}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
                    disabled={loading || !userId.trim()}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>

                {/* User Details Section */}
                {foundUser && (
                  <div className="border rounded-xl p-6 bg-gray-50">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <UserCircleIcon className="w-8 h-8 text-cyan-600" />
                          <h3 className="text-2xl font-semibold text-gray-800">
                            {foundUser.name}
                          </h3>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Email:</span>{" "}
                            {foundUser.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Department:</span>{" "}
                            {foundUser.department}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">ID:</span>{" "}
                            {foundUser._id}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleEditUser(foundUser._id)}
                          className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                        >
                          Edit User
                        </button>
                        <button
                          onClick={() => handleDeleteUser(foundUser._id)}
                          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                          Delete User
                        </button>
                        <button
                          onClick={() => {
                            setuserId("");
                            setFoundUser(null);
                          }}
                          className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
