import { useEffect, useState } from "react";
import api from "../api/axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/courses");

      setCourses(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, formData);
      } else {
        await api.post("/courses", formData);
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save course"
      );
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);

    setFormData({
      name: course.name,
      description: course.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete course"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Courses
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course Name"
            required
            className="rounded-lg border p-3"
          />

          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="rounded-lg border p-3"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
            {editingId ? "Update Course" : "Create Course"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-gray-500 px-5 py-3 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mb-4 text-red-600">{error}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t">
                  <td className="p-4">{course.id}</td>
                  <td className="p-4">{course.name}</td>
                  <td className="p-4">
                    {course.description}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="rounded bg-amber-500 px-3 py-2 text-sm text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course.id)}
                        className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500"
                  >
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Courses;