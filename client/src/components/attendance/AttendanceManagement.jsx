import React, { useState, useEffect } from "react";
import { attendanceAPI } from "../../services/api";

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scanTime, setScanTime] = useState(5);
  const [isScanning, setIsScanning] = useState(false);
  const [manualDevices, setManualDevices] = useState("");

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAll();
      setAttendanceRecords(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch attendance records");
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttendance = async () => {
    try {
      setIsScanning(true);
      setError("");
      const response = await attendanceAPI.startAttendance(scanTime);

      // Show success message and refresh records
      if (response.data.status === "success") {
        alert(`Attendance scanning started for ${scanTime} seconds`);
        // Wait for scan time + 2 seconds buffer, then refresh
        setTimeout(() => {
          fetchAttendanceRecords();
          setIsScanning(false);
        }, (scanTime + 2) * 1000);
      }
    } catch (err) {
      setError("Failed to start attendance scanning");
      console.error("Error starting attendance:", err);
      setIsScanning(false);
    }
  };

  const handleManualAttendance = async (e) => {
    e.preventDefault();
    try {
      const devices = manualDevices
        .split("\n")
        .map((device) => device.trim())
        .filter((device) => device.length > 0);

      if (devices.length === 0) {
        setError("Please enter at least one Bluetooth device ID");
        return;
      }

      const response = await attendanceAPI.markAttendance(devices);
      alert(`Attendance marked for ${response.data.count} students`);
      setManualDevices("");
      fetchAttendanceRecords();
    } catch (err) {
      setError("Failed to mark manual attendance");
      console.error("Error marking attendance:", err);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Attendance Management
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Attendance Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Auto Attendance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            Auto Attendance Scanning
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scan Time (seconds)
              </label>
              <input
                type="number"
                value={scanTime}
                onChange={(e) => setScanTime(parseInt(e.target.value))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleStartAttendance}
              disabled={isScanning}
              className={`w-full font-bold py-3 px-4 rounded transition duration-200 ${
                isScanning
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-700 text-white"
              }`}
            >
              {isScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </div>
              ) : (
                "Start Attendance Scan"
              )}
            </button>
          </div>
        </div>

        {/* Manual Attendance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-orange-700">
            Manual Attendance
          </h2>
          <form onSubmit={handleManualAttendance} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bluetooth Device IDs (one per line)
              </label>
              <textarea
                value={manualDevices}
                onChange={(e) => setManualDevices(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="3C:B0:ED:44:39:14&#10;AA:BB:CC:DD:EE:FF&#10;..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded transition duration-200"
            >
              Mark Attendance
            </button>
          </form>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Attendance Records
            </h2>
            <button
              onClick={fetchAttendanceRecords}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bluetooth ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.studentName || record.student?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {record.student?.bluetoothId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(record.time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendanceRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found. Start scanning to mark attendance.
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Records</h3>
          <p className="text-2xl font-bold text-blue-600">
            {attendanceRecords.length}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">
            Today's Attendance
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {
              attendanceRecords.filter((record) => {
                const today = new Date().toDateString();
                const recordDate = new Date(record.time).toDateString();
                return today === recordDate;
              }).length
            }
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">
            Unique Students
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {
              new Set(
                attendanceRecords.map(
                  (record) => record.student?._id || record.studentName
                )
              ).size
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
