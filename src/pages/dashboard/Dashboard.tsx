
import Header from "@/components/PrivateDashboard/DashboardHeader";
import LogoutForm from "@/components/PrivateDashboard/LogoutForm";
import Sidebar from "@/components/PrivateDashboard/Sidebar";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-50 min-h-[calc(100vh-25px)]">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Header
          toggleSidebar={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          confirmLogout={confirmLogout}
          setConfirmLogout={setConfirmLogout}
        />
        <main className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} mt-6 pt-16 p-6`}>
          <Outlet />
        </main>
      </div>
      {confirmLogout && <LogoutForm logoutConfirmLogout={confirmLogout} setLogoutConfirmLogout={setConfirmLogout} />}
    </>
  );
}

export default Dashboard;
