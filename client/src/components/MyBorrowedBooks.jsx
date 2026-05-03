import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { getAllBooks } from "../store/slices/bookSlice";
import Header from "../Layout/Header";
import BookA from '../assets/Book1.png';
import ReadBookPopup from "../popups/ReadBookPopup";

export default function MyBorrowedBooks() {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks, loading } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);
  const { user } = useSelector((state) => state.auth);
  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
    dispatch(getAllBooks());
  }, [dispatch]);

  const openReadPopup = (id) => {
    const book = books?.find((b) => b._id === id);
    setReadBook(book || { title: "Unknown Book", _id: id });
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
          <a href="/login" className="bg-black text-white px-6 py-2 rounded-lg">Go to Login</a>
        </div>
      </div>
    );
  }

  const activeBooks = userBorrowedBooks?.filter(b => !b.returned) || [];
  const returnedBooks = userBorrowedBooks?.filter(b => b.returned) || [];
  const displayBooks = filter === "active" ? activeBooks : returnedBooks;

  if (loading) {
    return (
      <main className="p-6 pt-28">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="p-6 pt-28">
        <Header />
        <h2 className="text-xl font-medium mb-4">My Borrowed Books</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "active" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Currently Borrowed ({activeBooks.length})
          </button>
          <button
            onClick={() => setFilter("returned")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "returned" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Returned Books ({returnedBooks.length})
          </button>
        </div>

        {/* Books Table */}
        {displayBooks.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {displayBooks.map((book, idx) => (
                  <tr key={idx} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{book.bookTitle || "Unknown Book"}</td>
                    <td className="px-4 py-2">{formatDateTime(book.borrowedDate)}</td>
                    <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        book.returned 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {book.returned ? "Returned" : "Borrowed"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <img
                        src={BookA}
                        alt="View"
                        className="w-7 h-7 cursor-pointer hover:opacity-70 transition"
                        onClick={() => openReadPopup(book.bookId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              {filter === "active" ? "No active borrows found!" : "No returned books found!"}
            </p>
          </div>
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
}