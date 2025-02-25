import React, { useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { LeaveRequest } from "../service/Api";

const YourComponent = ({ userId, dept }) => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Leave Application Submitted");
    console.log("User ID:", userId);
    console.log("Department:", dept);
    console.log("Start Date:", document.getElementById("startDate").value);
    console.log("End Date:", document.getElementById("endDate").value);
    console.log("Reason:", document.getElementById("reason").value);

    const leaveRequestData = {
      userId: userId,
      dept: dept,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      reason: document.getElementById("reason").value,
    };

    try {
      // Validate required fields
      if (
        !leaveRequestData.startDate ||
        !leaveRequestData.endDate ||
        !leaveRequestData.reason
      ) {
        alert("All fields (StartDate, EndDate, Reason, userId) are required.");
        return;
      }

      const response = await LeaveRequest(leaveRequestData);
      console.log("Response:", response);

      if (response.message === "Leave request submitted successfully.") {
        alert("Leave request submitted successfully!");
        setShowLeaveForm(false);
      } else if (
        response.error === "You already have a pending leave request."
      ) {
        alert("You already have a pending leave request.");
        console.log(response.error);
      } else if (response.error) {
        alert(`Error: ${response.error}`);
      } else {
        alert("Failed to submit leave request. Please try again.");
      }
    } catch (error) {
      if (
        error.response?.data?.error ===
        "You already have a pending leave request."
      ) {
        alert("You already have a pending leave request.");
      } else {
        console.error("Error submitting leave request:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start"
          onClick={() => setShowLeaveForm(true)}
        >
          <DocumentPlusIcon className="h-5 w-5 mr-2 ml-2" />
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
