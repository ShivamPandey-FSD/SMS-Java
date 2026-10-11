import { useEffect, useState } from "react";
import api from "../api/axios";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    studentId: "",
    teacherId: "",
    date: "",
    status: "PRESENT",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        attendanceResponse,
        studentResponse,
        teacherResponse,
      ] = await Promise.all([
        api.get("/attendance"),
        api.get("/students"),
        api.get("/teachers"),
      ]);

      setAttendance(attendanceResponse.data);
      setStudents(studentResponse.data);
      setTeachers(teacherResponse.data);

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load attendance data"
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
      teacherId: "",
      date: "",
      status: "PRESENT",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      studentId: Number(formData.studentId),
      teacherId: Number(formData.teacherId),
      date: formData.date,
      status: formData.status,
    };

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/attendance/${editingId}`,
          requestData
        );
      } else {
        await api.post("/attendance", requestData);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save attendance"
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      studentId: record.student?.id || "",
      teacherId: record.markedBy?.id || "",
      date: record.date || "",
      status: record.status || "PRESENT",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) {
      return;
    }

    try {
      await api.delete(`/attendance/${id}`);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete attendance"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Attendance
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-xl font-semibold">
          {editingId
            ? "Update Attendance"
            : "Mark Attendance"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
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

          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          >
            <option value="">Marked By Teacher</option>

            {teachers.map((teacher) => (
              <option
                key={teacher.id}
                value={teacher.id}
              >
                {teacher.user?.name ||
                  teacher.user?.email ||
                  `Teacher ${teacher.id}`}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-lg border p-3"
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        <div className="mt-5 flex gap-3">
          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
            {editingId
              ? "Update Attendance"
              : "Mark Attendance"}
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
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Marked By</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record) => (
                <tr
                  key={record.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {record.id}
                  </td>

                  <td className="p-4">
                    {record.student?.user?.name ||
                      record.student?.user?.email ||
                      `Student ${record.student?.id}`}
                  </td>

                  <td className="p-4">
                    {record.date}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        record.status === "PRESENT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {record.markedBy?.user?.name ||
                      record.markedBy?.user?.email ||
                      `Teacher ${record.markedBy?.id}`}
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

              {attendance.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No attendance records found
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

export default Attendance;