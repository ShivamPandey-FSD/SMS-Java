import { useEffect, useState } from "react";
import api from "../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      await api.post("/users", formData);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create user"
      );
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Users
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="rounded-lg border p-3"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>

        <button className="rounded-lg bg-blue-600 p-3 font-medium text-white md:col-span-2">
          Create User
        </button>
      </form>

      {error && (
        <p className="mb-4 text-red-600">
          {error}
        </p>
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
                <th className="p-4">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t"
                >
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;