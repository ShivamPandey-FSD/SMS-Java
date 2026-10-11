import { useEffect, useState } from "react";
import api from "../api/axios";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marks: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [marksResponse, studentResponse] =
        await Promise.all([
          api.get("/marks"),
          api.get("/students"),
        ]);

      setMarks(marksResponse.data);
      setStudents(studentResponse.data);

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load marks data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      subject: "",
      marks: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      studentId: Number(formData.studentId),
      subject: formData.subject,
      marks: Number(formData.marks),
    };

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/marks/${editingId}`,
          requestData
        );
      } else {
        await api.post("/marks", requestData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save marks"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      studentId: record.student?.id || "",
      subject: record.subject || "",
      marks: record.marks ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this marks record?")) {
      return;
    }

    try {
      await api.delete(`/marks/${id}`);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete marks"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Marks
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-xl font-semibold">
          {editingId ? "Update Marks" : "Add Marks"}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.user?.name ||
                  student.user?.email ||
                  `Student ${student.id}`}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            placeholder="Marks"
            required
            min="0"
            max="100"
            className="rounded-lg border p-3"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
            {editingId ? "Update Marks" : "Add Marks"}
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
        <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Student</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Marks</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {marks.map((record) => (
                <tr
                  key={record.id}
                  className="border-t"
                >
                  <td className="p-4">{record.id}</td>

                  <td className="p-4">
                    {record.student?.user?.name ||
                      record.student?.user?.email ||
                      `Student ${record.student?.id}`}
                  </td>

                  <td className="p-4">
                    {record.subject}
                  </td>

                  <td className="p-4">
                    {record.marks}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="rounded bg-amber-500 px-3 py-2 text-sm text-white"
                      >
                        Edit
                      </button>

                      {role === "SUPER_ADMIN" && (
                        <button
                          onClick={() =>
                            handleDelete(record.id)
                          }
                          className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {marks.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No marks found
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

export default Marks;