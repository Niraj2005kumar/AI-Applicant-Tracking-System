import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const AdminLayout = () => {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout-wrapper">
        <Sidebar />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;