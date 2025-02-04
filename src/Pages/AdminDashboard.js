import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { CurrentAttendanceByDate, studentbyRegisterNo } from "../service/Api";
import {
  ArrowPathIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  TableCellsIcon,
  UserCircleIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [activeTab, setActiveTab] = useState("attendance");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleLogout = () => logout();

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await CurrentAttendanceByDate();
      const data = response.data.studentAttendance;
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("Failed to fetch attendance data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const getAttendanceStats = () => {
    let presentCount = 0;
    let leaveCount = 0;

    attendanceData?.forEach((item) => {
      if (item.attendanceStatus === "present") presentCount++;
      else if (item.attendanceStatus === "leave") leaveCount++;
    });

    return { totalStudents: attendanceData.length, presentCount, leaveCount };
  };

  const { totalStudents, presentCount, leaveCount } = getAttendanceStats();

  const handleSearch = async () => {
    if (!registerNumber) {
      alert("Please enter a register number.");
      return;
    }
    try {
      setLoading(true);
      const response = await studentbyRegisterNo(registerNumber);
      setAttendanceReport(response.data.records || []);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("Failed to fetch attendance data for the given register number.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (attendanceReport.length === 0) {
      alert("No attendance data to preview. Please search first.");
      return;
    }
    setPreviewData(attendanceReport);
  };

  const handleGenerateReport = () => {
    const csvData = previewData
      .map(
        (item) =>
          `${item.name},${item.registrationNumber},${item.attendanceStatus}`
      )
      .join("\n");
    const blob = new Blob([`Name,Register Number,Status\n${csvData}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8 text-cyan-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "attendance"
                  ? "Today's Attendance Overview"
                  : "Student Reports Management"}
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

          <div className="flex justify-center space-x-4 mb-8">
            {[
              { id: "attendance", icon: TableCellsIcon },
              { id: "reports", icon: DocumentMagnifyingGlassIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-md transition-all ${
                    activeTab === tab.id
                      ? "bg-cyan-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
                </button>
              );
            })}
          </div>

          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6" />
                  Attendance Overview
                </h2>
                <button
                  onClick={fetchAttendanceData}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600/90 hover:bg-cyan-700 text-white rounded-xl shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowPathIcon className="w-4 h-4" />
                  )}
                  Refresh Data
                </button>
              </div>

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
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl p-6 ${stat.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{stat.title}</p>
                          <p className="text-3xl font-bold mt-2">
                            {stat.value}
                          </p>
                        </div>
                        <Icon className="w-12 h-12 opacity-20" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <TableCellsIcon className="w-5 h-5" />
                    Detailed Attendance Records
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Name", "Reg No", "Department", "Date", "Status"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.registrationNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.dateOnly}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <DocumentMagnifyingGlassIcon className="w-6 h-6" />
                  Student Attendance Report
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Search by Register Number
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        placeholder="Enter Register Number"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                            Search
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {searchPerformed && (
                    <div className="border-t border-gray-200 pt-6">
                      <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md hover:shadow-lg"
                      >
                        <TableCellsIcon className="w-4 h-4" />
                        Preview Report
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {previewData.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <TableCellsIcon className="w-5 h-5" />
                      Preview Report Data
                    </h3>
                    <button
                      onClick={handleGenerateReport}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md hover:shadow-lg"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.dateOnly}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.registrationNumber}
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
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
