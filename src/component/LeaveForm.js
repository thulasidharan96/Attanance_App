import React, { useState } from "react";
import { DocumentPlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import { LeaveRequest } from "../service/Api";

const YourComponent = ({ userId }) => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Leave Application Submitted");
    console.log("User ID:", userId);
    console.log("Start Date:", document.getElementById("startDate").value);
    console.log("End Date:", document.getElementById("endDate").value);
    console.log("Reason:", document.getElementById("reason").value);

    const leaveRequestData = {
      userId: userId,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      reason: document.getElementById("reason").value,
    };

    try {
      const response = await LeaveRequest(leaveRequestData);
      console.log("Response:", response);
      if (response.message === "Leave request submitted successfully.") {
        alert("Leave request submitted successfully!");
        setShowLeaveForm(false);
      } else {
        alert("Failed to submit leave request. Please try again.");
        setShowLeaveForm(false);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  const showLeaveRequestStatus = () => {
    console.log("Show Leave Request Status");
    console.log("User ID:", userId);
  };

  return (
    <div>
      <h2 className="gap-2 text-xl font-semibold">Leave Request</h2>
      <div className="flex flex-row gap-2">
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start"
          onClick={() => setShowLeaveForm(true)}
        >
          <DocumentPlusIcon className="h-5 w-5 mr-2" />
        </button>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start"
          onClick={showLeaveRequestStatus}
        >
          <EyeIcon className="h-5 w-5 mr-2" />
        </button>
      </div>

      {showLeaveForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Leave Application</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="startDate">Start Date:</label>
              <br />
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full mb-4 p-2 border rounded-lg"
                min="2025-02-15"
              />
              <br />
              <label htmlFor="endDate">End Date:</label>
              <br />
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full mb-4 p-2 border rounded-lg"
              />
              <br />
              <label htmlFor="reason">Reason:</label>
              <br />
              <textarea
                id="reason"
                name="reason"
                rows="4"
                className="w-full mb-4 p-2 border rounded-lg"
              ></textarea>
              <br />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourComponent;
