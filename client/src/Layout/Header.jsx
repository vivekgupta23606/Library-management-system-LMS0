import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserIcon from "../assets/UserIcon.png";
import SettingIcon from "../assets/settingIcon.png";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="absolute top-0 bg-white w-full py-4 px-6 left-0 shadow-md flex justify-between items-center z-20">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <img src={UserIcon} alt="userIcon" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col">
          <span className="text-sm font-medium sm:text-lg lg:text-xl sm:font-semibold">
            {user?.name || "Guest"}
          </span>
          <span className="text-sm font-medium sm:text-lg sm:font-medium">
            {user?.role || "User"}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col text-sm lg:text-base font-semibold text-right">
          <span>{currentTime}</span>
          <span>{currentDate}</span>
        </div>
        <span className="hidden md:block bg-gray-300 h-10 w-[1px]" />
        <button
          onClick={() => dispatch(toggleSettingPopup())}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <img src={SettingIcon} alt="setting" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}