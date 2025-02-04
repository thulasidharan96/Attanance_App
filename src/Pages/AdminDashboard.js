import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { CurrentAttendanceByDate, studentbyRegisterNo } from "../service/Api";

const AdminDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [activeTab, setActiveTab] = useState("attendance");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {['attendance', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "attendance" && (
            <div>
              <button
                className="flex items-center gap-2 m-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-md hover:shadow-lg"
                onClick={fetchAttendanceData}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5">&#9696;</span>
                ) : (
                  "Refresh Data"
                )}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {[{
                  title: "Total Students",
                  value: totalStudents,
                  color: "bg-blue-500"
                }, {
                  title: "Present Today",
                  value: presentCount,
                  color: "bg-green-500"
                }, {
                  title: "Leave Today",
                  value: leaveCount,
                  color: "bg-red-500"
                }].map((stat, index) => (
                  <div key={index} className={`rounded-xl shadow-md p-6 ${stat.color} text-white`}>
                    <h3 className="text-sm font-medium">{stat.title}</h3>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-lg mt-6">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Attendance Records</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Name", "Reg No", "Department", "Date", "Status"].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.registrationNumber}</td>
                          <td className="px-3 py-2">{item.department}</td>
                          <td className="px-3 py-2">{item.dateOnly}</td>
                          <td className="px-3 py-2">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${item.attendanceStatus === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Generate Reports</h2>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-2">Search by Register Number</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="Enter Register Number"
                      className="flex-1 p-2 border rounded-lg focus:ring-cyan-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    >
                      Search
                    </button>
                  </div>
                  <button
                    onClick={handlePreview}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Preview Report
                  </button>
                </div>

                {previewData.length > 0 && (
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Preview Data</h3>
                    <ul className="space-y-2">
                      {previewData.map((item, index) => (
                        <li key={index} className="p-2 bg-white rounded shadow-md">
                          {`${item.name} (${item.registrationNumber}) - ${item.attendanceStatus}`}
                        </li>
                      ))}
                    </ul>
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