import React, { useState, useEffect } from "react";
import { teacherAPI } from "../../services/api";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    bluetoothId: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAll();
      setTeachers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch teachers");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teacherAPI.update(editingTeacher._id, formData);
        setEditingTeacher(null);
      } else {
        await teacherAPI.create(formData);
        setShowAddForm(false);
      }
      setFormData({ name: "", email: "", subject: "", bluetoothId: "" });
      fetchTeachers();
    } catch (err) {
      setError("Failed to save teacher");
      console.error("Error saving teacher:", err);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      bluetoothId: teacher.bluetoothId,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await teacherAPI.delete(id);
        fetchTeachers();
      } catch (err) {
        setError("Failed to delete teacher");
        console.error("Error deleting teacher:", err);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTeacher(null);
    setFormData({ name: "", email: "", subject: "", bluetoothId: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Teachers Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Add Teacher
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showAddForm || editingTeacher) && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bluetooth ID
                </label>
                <input
                  type="text"
                  value={formData.bluetoothId}
                  onChange={(e) =>
                    setFormData({ ...formData, bluetoothId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 3C:B0:ED:44:39:14"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                {editingTeacher ? "Update" : "Add"} Teacher
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bluetooth ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {teacher.bluetoothId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="text-red-600 hover:text-red-900 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No teachers found. Add some teachers to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
