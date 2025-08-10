import React, { useState, useEffect } from "react";
import { studentAPI, teacherAPI, attendanceAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAttendance: 0,
    todayAttendance: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, teachersRes, attendanceRes] = await Promise.all([
        studentAPI.getAll(),
        teacherAPI.getAll(),
        attendanceAPI.getAll(),
      ]);

      const students = studentsRes.data;
      const teachers = teachersRes.data;
      const attendance = attendanceRes.data;

      // Calculate today's attendance
      const today = new Date().toDateString();
      const todayAttendance = attendance.filter((record) => {
        const recordDate = new Date(record.time).toDateString();
        return today === recordDate;
      });

      // Get recent attendance (last 5 records)
      const recent = attendance
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalAttendance: attendance.length,
        todayAttendance: todayAttendance.length,
      });

      setRecentAttendance(recent);
      setError("");
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Students</h3>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="text-4xl opacity-80">👨‍🎓</div>
          </div>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Teachers</h3>
              <p className="text-3xl font-bold">{stats.totalTeachers}</p>
            </div>
            <div className="text-4xl opacity-80">👨‍🏫</div>
          </div>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Attendance</h3>
              <p className="text-3xl font-bold">{stats.totalAttendance}</p>
            </div>
            <div className="text-4xl opacity-80">📝</div>
          </div>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Today's Attendance</h3>
              <p className="text-3xl font-bold">{stats.todayAttendance}</p>
            </div>
            <div className="text-4xl opacity-80">📅</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Attendance
          </h2>
          {recentAttendance.length > 0 ? (
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.studentName || record.student?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.student?.bluetoothId || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDateTime(record.time)}
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Present
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent attendance records</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center space-x-2">
              <span>📡</span>
              <span>Start Attendance Scan</span>
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center space-x-2">
              <span>👨‍🎓</span>
              <span>Add New Student</span>
            </button>
            <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center space-x-2">
              <span>👨‍🏫</span>
              <span>Add New Teacher</span>
            </button>
            <button className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Server Connection: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Database: Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">BLE Scanner: Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
