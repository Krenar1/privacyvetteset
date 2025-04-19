import { LayoutDashboard, Globe2, Mail, Activity, MailCheck, MailX, DollarSign, Globe, Cookie } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const menuItems = [
    { icon: Activity, text: "Overview", link:"overview" },
    { icon: Globe2, text: "Keywords",link:"keywords" },
    { icon: LayoutDashboard, text: "Websites",link:"websites" },
    { icon: MailX, text: "Emails",link:"emails" },
    { icon: MailCheck, text: "Sent Emails",link:"sentemails" },
    { icon: DollarSign, text: "Products & Pricing",link:"products" },
    { icon: Globe, text: "Subdomains",link:"subdomains" },
    { icon: Cookie, text: "Cookie Tool",link:"cookie-tool" },
  ];
  // Change Icons

  return (
    <div className={`bg-primary text-white h-screen fixed top-0 left-0 transition-all duration-100 ${isSidebarOpen ? "w-64" : "w-20"}`}>
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-800">
        <span className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
      </div>
      <nav className="p-4">
        {menuItems.map((item, i) => (
          <NavLink
          key={item.text}
          to={item.link}
          className="flex items-center mb-2 gap-4 text-gray-100 hover:text-white hover:bg-[rgb(22,156,207)] rounded-lg p-3 transition-colors h-[50px]"
        >
          <item.icon size={20} color="white" />
          <span className={`${!isSidebarOpen && "hidden"} text-white`}>{item.text}</span>
        </NavLink>

        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
