import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type LogoutProps = {
  logoutConfirmLogout: boolean;
  setLogoutConfirmLogout: (value: boolean) => void;
};

function LogoutForm({ setLogoutConfirmLogout }: LogoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <>
      <div className="absolute w-screen top-0 bottom-0 left-0 min-h-full z-50 flex items-center justify-center bg-black/50">
        <div className="flex  bg-gray-100 min-w-[400px] min-h-[240px] p-[10px] px-[20px]  flex-col items-center justify-center text-white rounded-[10px] font-medium gap-[40px]">
          <h2 style={{ fontSize: "18px",color:"black" }}>Are you sure you want to log out?</h2>
          <div className="flex gap-[50px] text-gray-900">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="p-2 px-4 bg-[black] hover:bg-gray-800 text-white rounded-lg relative"
            >
              Yes
            </button>
            <button onClick={() => setLogoutConfirmLogout(false)} className="p-2 px-4 bg-[black] text-white hover:bg-gray-800 rounded-lg relative">
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default LogoutForm;
