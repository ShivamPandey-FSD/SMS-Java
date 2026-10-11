import { useEffect, useState } from "react";
import api from "../api/axios";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userId: "",
    subject: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [teacherResponse, userResponse] =
        await Promise.all([
          api.get("/teachers"),
          api.get("/users"),
        ]);

      setTeachers(teacherResponse.data);
      setUsers(userResponse.data);

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load teachers"
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/teachers", {
        userId: Number(formData.userId),
        subject: formData.subject,
      });

      setFormData({
        userId: "",
        subject: "",
      });

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create teacher"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) {
      return;
    }

    try {
      await api.delete(`/teachers/${id}`);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete teacher"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Teachers
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
          className="rounded-lg border p-3"
        >
          <option value="">Select Teacher User</option>

          {users
            .filter((user) => user.role === "TEACHER")
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
        </select>

        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
          className="rounded-lg border p-3"
        />

        <button className="rounded-lg bg-blue-600 p-3 font-medium text-white md:col-span-2">
          Create Teacher
        </button>
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
                <th className="p-4">Email</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-t">
                  <td className="p-4">{teacher.id}</td>
                  <td className="p-4">
                    {teacher.user?.name}
                  </td>
                  <td className="p-4">
                    {teacher.user?.email}
                  </td>
                  <td className="p-4">{teacher.subject}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Teachers;