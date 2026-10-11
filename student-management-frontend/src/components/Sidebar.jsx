import { NavLink } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      roles: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    },
    {
      name: "Users",
      path: "/users",
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Students",
      path: "/students",
      roles: ["SUPER_ADMIN", "TEACHER"],
    },
    {
      name: "Teachers",
      path: "/teachers",
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Courses",
      path: "/courses",
      roles: ["SUPER_ADMIN", "TEACHER", "STUDENT"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      roles: ["SUPER_ADMIN", "TEACHER"],
    },
    {
      name: "Marks",
      path: "/marks",
      roles: ["SUPER_ADMIN", "TEACHER"],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-5 text-white">
      <h1 className="mb-8 text-2xl font-bold">
        SMS
      </h1>

      <nav className="space-y-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;