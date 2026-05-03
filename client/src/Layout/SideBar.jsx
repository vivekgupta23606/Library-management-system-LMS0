import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo_with_title from "../assets/logo_with_textdata1.png";
import DashBoardIcon from "../assets/dashBoard.png";
import BookIcon from "../assets/bookIcon.png";
import CatalogIcon from "../assets/CatalogIcon.png";
import UsersIcon from "../assets/UserIcon.png";
import SettingIcon from "../assets/settingIcon.png";
import LogoutIcon from "../assets/logoutIcon.png";
import CloseIcon from "../assets/closeIcon.png";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import { RiAdminFill } from "react-icons/ri";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

export default function SideBar({ isSideBarOpen, setIsSideBarOpen, setIsSelectedComponent }) {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);
  const { error, message, user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [error, message, dispatch]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed md:relative z-30 flex flex-col bg-black text-white transition-all duration-300
          ${isSideBarOpen ? "left-0" : "-left-64"} 
          md:left-0 w-64 h-full
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 my-4 border-b border-gray-700">
          <img src={logo_with_title} alt="logo" className="w-full" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <NavButton icon={DashBoardIcon} label="Dashboard" onClick={() => setIsSelectedComponent("Dashboard")} />
          <NavButton icon={BookIcon} label="Books" onClick={() => setIsSelectedComponent("Books")} />

          {isAuthenticated && user?.role === "Admin" && (
            <>
              <NavButton icon={CatalogIcon} label="Catalog" onClick={() => setIsSelectedComponent("Catalog")} />
              <NavButton icon={UsersIcon} label="Users" onClick={() => setIsSelectedComponent("Users")} />
              <NavButton icon={RiAdminFill} label="Add New Admin" onClick={() => dispatch(toggleAddNewAdminPopup())} isIcon />
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <NavButton icon={CatalogIcon} label="My Borrowed Books" onClick={() => setIsSelectedComponent("My Borrowed Books")} />
          )}

          {/* Mobile only setting button */}
          <button
            className="md:hidden w-full py-3 font-medium rounded-md hover:cursor-pointer flex items-center space-x-3 hover:bg-gray-800 transition"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={SettingIcon} alt="icon" className="w-5 h-5" />
            <span>Change Password</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-3 font-medium rounded-md hover:cursor-pointer flex items-center justify-center space-x-3 hover:bg-red-600 transition"
          >
            <img src={LogoutIcon} alt="logout" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Close button for mobile */}
        {isSideBarOpen && (
          <button
            onClick={() => setIsSideBarOpen(false)}
            className="absolute top-4 right-4 md:hidden p-1 rounded-full hover:bg-gray-700"
          >
            <img src={CloseIcon} alt="close" className="w-6 h-6" />
          </button>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
}

// Helper component for navigation buttons
const NavButton = ({ icon, label, onClick, isIcon }) => (
  <button
    onClick={onClick}
    className="w-full py-3 font-medium rounded-md hover:cursor-pointer flex items-center space-x-3 hover:bg-gray-800 transition"
  >
    {isIcon ? (
      <icon className="w-5 h-5" />
    ) : (
      <img src={icon} alt={label} className="w-5 h-5" />
    )}
    <span>{label}</span>
  </button>
);