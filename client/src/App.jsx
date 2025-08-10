import React, { useState } from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/students/StudentList";
import TeacherList from "./components/teachers/TeacherList";
import AttendanceManagement from "./components/attendance/AttendanceManagement";

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentList />;
      case "teachers":
        return <TeacherList />;
      case "attendance":
        return <AttendanceManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto">{renderCurrentPage()}</main>
    </div>
  );
};

export default App;
