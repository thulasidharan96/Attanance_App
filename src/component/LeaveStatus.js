import React, { useState } from "react";
import { EyeIcon, RefreshCw } from "lucide-react";
import { getRecentLeaveStatus } from "../service/Api";

const LeaveStatus = ({ userId }) => {
  const [showLeaveStatus, setShowLeaveStatus] = useState(false);
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLeaveStatus = async () => {
    setLoading(true);
    try {
      const response = await getRecentLeaveStatus(userId);
      console.log(response);

      if (response?.recentLeaveRequest) {
        const { StartDate, EndDate, Reason, status } =
          response.recentLeaveRequest;

        setLeaveData({
          startDate: new Date(StartDate).toLocaleDateString(),
          endDate: new Date(EndDate).toLocaleDateString(),
          reason: Reason || "No Reason Provided",
          status: status || "Pending",
        });
      } else {
        setLeaveData(null);
      }
    } catch (error) {
      console.error("Error fetching leave status:", error);
      setLeaveData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Rejected":
        return "bg-red-200 text-red-800"; // Added for Rejected status
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <button
        onClick={() => {
          setShowLeaveStatus(true);
          fetchLeaveStatus();
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-lg gap-2 flex items-center justify-center sm:justify-start shadow-md hover:bg-green-600 transition-all"
        disabled={loading}
      >
        <EyeIcon className="h-5 w-5 mr-2" />
        {loading ? "Loading..." : ""}
      </button>

      {showLeaveStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">
              Leave Request Status
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center">
                Fetching leave status...
              </p>
            ) : leaveData ? (
              <div className="space-y-3">
                <p className="flex justify-between">
                  <strong>Start Date:</strong>{" "}
                  <span>{leaveData.startDate}</span>
                </p>
                <p className="flex justify-between">
                  <strong>End Date:</strong> <span>{leaveData.endDate}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Reason:</strong> <span>{leaveData.reason}</span>
                </p>
                <p className="flex justify-between">
                  <strong>Status:</strong>
                  <span
                    className={`px-3 py-1 rounded-lg ${getStatusClasses(
                      leaveData.status
                    )}`}
                  >
                    {leaveData.status}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No Previous Leave Data
              </p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowLeaveStatus(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                Close
              </button>
              <button
                onClick={fetchLeaveStatus}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 transition-all"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveStatus;
