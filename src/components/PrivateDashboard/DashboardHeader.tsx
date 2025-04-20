import { Menu, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type HeaderProps = {
  toggleSidebar: () => void;
  confirmLogout: boolean;
  setConfirmLogout: (value: boolean) => void;
};

function Header({ toggleSidebar, confirmLogout, setConfirmLogout }: HeaderProps) {
  const { user } = useAuth();
  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 h-16 fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-4">
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4 mr-2">
        <ThemeToggle />
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <User size={16} />
          <span>{user?.username || 'Admin'}</span>
        </div>
        <button onClick={() => setConfirmLogout(true)} className="p-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
          Log out
        </button>
      </div>
    </header>
  );
}

export default Header;
