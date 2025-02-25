import React, { useState, useEffect } from "react";
import { getAllPendingLeaveRequests } from "../service/Api";

const AdminLeaveStatus = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaveStatus();
  }, []);

  const fetchLeaveStatus = async () => {
    setLoading(true);
    try {
      const response = await getAllPendingLeaveRequests();
      setLeaveData(response?.leaveRequests || []);
    } catch (error) {
      console.error("Error fetching leave status:", error);
      setLeaveData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = (id, status) => {
    setLeaveData((prevData) =>
      prevData.map((item) => (item._id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl mx-auto border border-gray-200 w-full">
      <div className="flex flex-row md:flex-row justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-700 mb-4 md:mb-0">
          Leave Requests
        </h3>
        <button
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={fetchLeaveStatus}
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm md:text-base rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="text-left">
                <th className="border px-3 py-2 md:px-4 md:py-3">Name</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">Reg No</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">Reason</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">Start Date</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">End Date</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">Status</th>
                <th className="border px-3 py-2 md:px-4 md:py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 transition text-left"
                >
                  <td className="border px-3 py-2 md:px-4 md:py-3">
                    {item.user?.name}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3">
                    {item.user?.RegisterNumber || item.RegisterNumber}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3 truncate max-w-xs text-gray-600">
                    {item.Reason}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3">
                    {new Date(item.StartDate).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3">
                    {new Date(item.EndDate).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3 font-semibold text-gray-700">
                    {item.status}
                  </td>
                  <td className="border px-3 py-2 md:px-4 md:py-3 flex flex-wrap gap-2 md:gap-3">
                    <button
                      className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                      onClick={() => updateLeaveStatus(item._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                      onClick={() => updateLeaveStatus(item._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveStatus;
