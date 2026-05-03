import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../store/slices/bookSlice";
import { getAllUsers } from "../store/slices/userSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import logo from "../assets/logo1.png";
import Header from "../Layout/Header";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(getAllBooks());
    dispatch(getAllUsers());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    setTotalBooks(books?.length || 0);
    setTotalUsers(users?.filter(u => u.role === "User").length || 0);
    setTotalAdmin(users?.filter(u => u.role === "Admin").length || 0);
    setTotalBorrowedBooks(allBorrowedBooks?.filter(b => !b.returnDate).length || 0);
    setTotalReturnedBooks(allBorrowedBooks?.filter(b => b.returnDate).length || 0);
  }, [users, allBorrowedBooks, books]);

  const chartData = {
    labels: ["Borrowed Books", "Returned Books"],
    datasets: [{
      data: [totalBorrowedBooks, totalReturnedBooks],
      backgroundColor: ["#3D3E3E", "#151619"],
      hoverOffset: 4,
    }],
  };

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={logo} title="Total Books" value={totalBooks} color="bg-blue-500" />
          <StatCard icon={logo} title="Total Users" value={totalUsers} color="bg-green-500" />
          <StatCard icon={logo} title="Total Admins" value={totalAdmin} color="bg-purple-500" />
          <StatCard icon={logo} title="Active Borrows" value={totalBorrowedBooks} color="bg-orange-500" />
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-3">Book Statistics</h3>
          <Pie data={chartData} options={{ responsive: true }} />
          <div className="mt-4 space-y-1">
            <p className="flex justify-between"><span>Borrowed:</span><strong>{totalBorrowedBooks}</strong></p>
            <p className="flex justify-between"><span>Returned:</span><strong>{totalReturnedBooks}</strong></p>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <img src={user?.avatar?.url || logo} alt="Admin" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h2 className="text-xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">Manage your library, track books, and monitor users from here.</p>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-6 bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-lg text-center">
        <p className="text-lg italic">"Reading is to the mind what exercise is to the body."</p>
        <p className="text-sm mt-2">- BookWorm Team</p>
      </div>
    </main>
  );
}

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} text-white p-4 rounded-lg shadow flex items-center gap-4`}>
    <img src={icon} alt={title} className="w-12 h-12 bg-white rounded-full p-2" />
    <div>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);