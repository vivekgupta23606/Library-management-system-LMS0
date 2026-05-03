// src/components/Users.jsx - Add mobile column

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Layout/Header";
import { getAllUsers } from "../store/slices/userSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };
  
  const filteredUsers = users?.filter((u) => u.role === "User") || [];
  
  if (loading) {
    return (
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      
      <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
          Registered Users ({filteredUsers.length})
        </h2>
      </header>
      
      {filteredUsers.length > 0 ? (
        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>  {/* ✅ ADD THIS COLUMN */}
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-center">Books Borrowed</th>
                <th className="px-4 py-2 text-center">Joined On</th>
               </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.name || "N/A"}</td>
                  <td className="px-4 py-2">{user.email || "N/A"}</td>
                  <td className="px-4 py-2">{user.mobile || "N/A"}</td>  {/* ✅ ADD THIS */}
                  <td className="px-4 py-2">{user.role || "User"}</td>
                  <td className="px-4 py-2 text-center">
                    {user.borrowedBooks?.length || 0}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {formatDate(user.createdAt)}
                  </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      ) : (
        <div className="mt-6 text-center py-8 bg-white rounded-md shadow-lg">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </main>
  );
}