import React from "react";

const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "students", label: "Students", icon: "👨‍🎓" },
    { id: "teachers", label: "Teachers", icon: "👨‍🏫" },
    { id: "attendance", label: "Attendance", icon: "📝" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">🎓 BLE Attendance System</h1>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-4 py-2 rounded-md transition duration-200 flex items-center space-x-2 ${
                currentPage === item.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
