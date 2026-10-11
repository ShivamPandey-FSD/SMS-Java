import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    navigate("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="font-semibold text-gray-800">
          Student Management System
        </h2>

        {role && (
          <p className="text-xs text-gray-500">
            {role.replaceAll("_", " ")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {name && (
          <span className="text-sm text-gray-600">
            {name}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;