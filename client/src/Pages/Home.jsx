import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../Layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import AddBookPopup from "../popups/AddBookPopup";
import AddNewAdmin from "../popups/AddNewAdmin";
import RecordBookPopup from "../popups/RecordBookPopup";
import SettingPopup from "../popups/SettingPopup";
import { closeAllPopup } from "../store/slices/popUpSlice";

export default function Home() {
  const dispatch = useDispatch();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [borrowBookId, setBorrowBookId] = useState(null);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const {
    addBookPopup,
    addNewAdminPopup,
    recordBookPopup,
    settingPopup,
  } = useSelector((state) => state.popup);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const handleClosePopup = () => {
    dispatch(closeAllPopup());
    setBorrowBookId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setIsSelectedComponent={setSelectedComponent}
      />

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="bg-black text-white p-2 rounded-md shadow-lg"
        >
          <GiHamburgerMenu className="text-2xl" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto h-full">
        {/* Dynamic Component */}
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard setSelectedComponent={setSelectedComponent} />
              );
            case "Books":
              return <BookManagement setBorrowBookId={setBorrowBookId} />;
            case "Catalog":
              if (user.role === "Admin") return <Catalog />;
              break;
            case "Users":
              if (user.role === "Admin") return <Users />;
              break;
            case "My Borrowed Books":
              return <MyBorrowedBooks />;
            default:
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard setSelectedComponent={setSelectedComponent} />
              );
          }
        })()}
      </div>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {addNewAdminPopup && <AddNewAdmin />}
      {recordBookPopup && borrowBookId && <RecordBookPopup bookId={borrowBookId} />}
      {settingPopup && <SettingPopup />}
    </div>
  );
}