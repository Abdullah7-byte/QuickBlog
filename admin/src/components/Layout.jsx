import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-6 py-6 bg-[#f7fbff]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;