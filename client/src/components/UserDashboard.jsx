import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import logo from "../assets/logo1.png";
import Header from "../Layout/Header";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);

  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalReturned, setTotalReturned] = useState(0);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    setTotalBorrowed(userBorrowedBooks?.filter(b => !b.returned).length || 0);
    setTotalReturned(userBorrowedBooks?.filter(b => b.returned).length || 0);
  }, [userBorrowedBooks]);

  const chartData = {
    labels: ["Currently Borrowed", "Returned"],
    datasets: [{
      data: [totalBorrowed, totalReturned],
      backgroundColor: ["#4f46e5", "#10b981"],
      hoverOffset: 4,
    }],
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <img src={user?.avatar?.url || logo} alt="User" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-bold">Welcome, {user?.name}!</h2>
              <p className="text-gray-600">Track your borrowed books and reading journey.</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-3">Your Reading Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{totalBorrowed}</p>
              <p className="text-sm text-gray-600">Currently Borrowed</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{totalReturned}</p>
              <p className="text-sm text-gray-600">Books Returned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-3">Borrowing Summary</h3>
        <div className="max-w-xs mx-auto">
          <Pie data={chartData} />
        </div>
      </div>

      {/* Quote */}
      <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg text-center">
        <p className="text-lg italic">"A reader lives a thousand lives before he dies."</p>
        <p className="text-sm mt-2">- George R.R. Martin</p>
      </div>
    </main>
  );
}