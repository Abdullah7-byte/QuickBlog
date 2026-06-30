import {
  LayoutDashboard,
  SquarePlus,
  List,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Add blogs",
      path: "/admin/add-blog",
      icon: SquarePlus,
    },
    {
      name: "Blogs list",
      path: "/admin/blog-list",
      icon: List,
    },
    {
      name: "Comments",
      path: "/admin/comments",
      icon: MessageCircle,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <div className="pt-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-indigo-50 border-r-4 border-primary text-black"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;