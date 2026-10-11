import { useEffect, useState } from "react";
import api from "../api/axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    userId: "",
    courseId: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Super Admin needs Students + Users + Courses
      if (role === "SUPER_ADMIN") {
        const [
          studentResponse,
          userResponse,
          courseResponse,
        ] = await Promise.all([
          api.get("/students"),
          api.get("/users"),
          api.get("/courses"),
        ]);

        setStudents(studentResponse.data);
        setUsers(userResponse.data);
        setCourses(courseResponse.data);
      }

      // Teacher only needs Students
      else if (role === "TEACHER") {
        const studentResponse = await api.get("/students");

        setStudents(studentResponse.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE STUDENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/students", {
        ...formData,
        userId: Number(formData.userId),
        courseId: Number(formData.courseId),
      });

      setFormData({
        userId: "",
        courseId: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
      });

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create student"
      );
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await api.delete(`/students/${id}`);

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete student"
      );
    }
  };

  return (
    <div>
      {/* =========================
          PAGE TITLE
      ========================== */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Students
        </h1>

        {role === "TEACHER" && (
          <p className="mt-2 text-sm text-gray-500">
            View student records
          </p>
        )}
      </div>

      {/* =========================
          CREATE STUDENT
          SUPER ADMIN ONLY
      ========================== */}

      {role === "SUPER_ADMIN" && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800">
              Create Student
            </h2>
          </div>

          {/* USER */}

          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          >
            <option value="">
              Select Student User
            </option>

            {users
              .filter(
                (user) => user.role === "STUDENT"
              )
              .map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name} - {user.email}
                </option>
              ))}
          </select>

          {/* COURSE */}

          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          >
            <option value="">
              Select Course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.name}
              </option>
            ))}
          </select>

          {/* PHONE */}

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="rounded-lg border p-3"
          />

          {/* GENDER */}

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          >
            <option value="">
              Select Gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>

          {/* DATE OF BIRTH */}

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="rounded-lg border p-3"
          />

          {/* CREATE BUTTON */}

          <button
            type="submit"
            className="rounded-lg bg-blue-600 p-3 font-medium text-white md:col-span-2"
          >
            Create Student
          </button>
        </form>
      )}

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          STUDENT TABLE
      ========================== */}

      {loading ? (
        <p className="text-gray-500">
          Loading students...
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">
                  ID
                </th>

                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Email
                </th>

                <th className="p-4">
                  Course
                </th>

                <th className="p-4">
                  Phone
                </th>

                <th className="p-4">
                  Gender
                </th>

                <th className="p-4">
                  Date of Birth
                </th>

                {role === "SUPER_ADMIN" && (
                  <th className="p-4">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-t"
                >
                  {/* ID */}

                  <td className="p-4">
                    {student.id}
                  </td>

                  {/* NAME */}

                  <td className="p-4">
                    {student.user?.name || "-"}
                  </td>

                  {/* EMAIL */}

                  <td className="p-4">
                    {student.user?.email || "-"}
                  </td>

                  {/* COURSE */}

                  <td className="p-4">
                    {student.course?.name || "-"}
                  </td>

                  {/* PHONE */}

                  <td className="p-4">
                    {student.phone}
                  </td>

                  {/* GENDER */}

                  <td className="p-4">
                    {student.gender}
                  </td>

                  {/* DOB */}

                  <td className="p-4">
                    {student.dateOfBirth || "-"}
                  </td>

                  {/* DELETE
                      SUPER ADMIN ONLY */}

                  {role === "SUPER_ADMIN" && (
                    <td className="p-4">
                      <button
                        onClick={() =>
                          handleDelete(student.id)
                        }
                        className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {/* NO STUDENTS */}

              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={
                      role === "SUPER_ADMIN"
                        ? "8"
                        : "7"
                    }
                    className="p-6 text-center text-gray-500"
                  >
                    No students found
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

export default Students;