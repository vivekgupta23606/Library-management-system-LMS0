import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import Header from "../Layout/Header";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import ReturnIcon from '../assets/return.png';
import { Search, Filter, X } from "lucide-react";

export default function Catalog() {
  const dispatch = useDispatch();
  const { allBorrowedBooks, loading } = useSelector((state) => state.borrow);
  const { returnBookPopup } = useSelector((state) => state.popup);
  const [returnData, setReturnData] = useState({ bookId: "", email: "" });
  const [filter, setFilter] = useState("active");
  
  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, name, email, mobile

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFineStatus = (dueDate, returnDate, fine) => {
    if (returnDate) {
      if (fine > 0) {
        return <span className="text-red-600 font-semibold">₹{fine} (Late Fine)</span>;
      }
      return <span className="text-green-600">No Fine</span>;
    }
    
    const today = new Date();
    const due = new Date(dueDate);
    
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    if (today > due) {
      const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      return <span className="text-red-500">Overdue by {daysLate} day{daysLate > 1 ? 's' : ''}</span>;
    }
    return <span className="text-yellow-600">Due on {formatDate(dueDate)}</span>;
  };

  const handleReturnClick = (bookId, email) => {
    if (!bookId || !email) return toast.error("Invalid data");
    setReturnData({ bookId, email });
    dispatch(toggleReturnBookPopup());
  };

  // ✅ Search filter function
  const getFilteredBorrows = (borrows) => {
    if (!searchTerm.trim()) return borrows;
    
    const term = searchTerm.toLowerCase().trim();
    
    return borrows.filter(borrow => {
      const userName = (borrow.user?.name || "").toLowerCase();
      const userEmail = (borrow.user?.email || "").toLowerCase();
      const userMobile = (borrow.user?.mobile || "").toLowerCase();
      const bookTitle = (borrow.book?.title || borrow.bookTitle || "").toLowerCase();
      
      if (searchType === "name") {
        return userName.includes(term);
      } else if (searchType === "email") {
        return userEmail.includes(term);
      } else if (searchType === "mobile") {
        return userMobile.includes(term);
      } else {
        // Search in all fields
        return userName.includes(term) || 
               userEmail.includes(term) || 
               userMobile.includes(term) || 
               bookTitle.includes(term);
      }
    });
  };

  const activeBorrows = allBorrowedBooks?.filter(b => !b.returnDate) || [];
  const returnedBorrows = allBorrowedBooks?.filter(b => b.returnDate) || [];

  let displayedBorrows = [];
  if (filter === "active") displayedBorrows = activeBorrows;
  else if (filter === "returned") displayedBorrows = returnedBorrows;
  else displayedBorrows = allBorrowedBooks || [];

  // ✅ Apply search filter
  const filteredBorrows = getFilteredBorrows(displayedBorrows);
  const searchActive = searchTerm.trim() !== "";

  if (loading && !allBorrowedBooks?.length) {
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
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Book Borrowing Catalog
          </h2>
        </header>

        {/* Filter and Search Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "active" 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active Borrows ({activeBorrows.length})
            </button>
            <button
              onClick={() => setFilter("returned")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "returned" 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Returned Books ({returnedBorrows.length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all" 
                  ? "bg-black text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Records ({allBorrowedBooks?.length || 0})
            </button>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search by ${searchType === "all" ? "name, email, mobile or book" : searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Fields</option>
              <option value="name">User Name</option>
              <option value="email">User Email</option>
              <option value="mobile">User Mobile</option>
            </select>
            
            {searchActive && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-3 py-2 text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <X size={16} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchActive && (
          <div className="mb-3 text-sm text-gray-500">
            Found {filteredBorrows.length} result(s) for "{searchTerm}" in {searchType === "all" ? "all fields" : searchType}
          </div>
        )}

        {/* Table */}
        {filteredBorrows.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">S.No</th>
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">User Email</th>
                  <th className="px-4 py-2 text-left">User Mobile</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Return Date</th>
                  <th className="px-4 py-2 text-left">Fine Status</th>
                  {filter !== "returned" && (
                    <th className="px-4 py-2 text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBorrows.map((borrow, index) => {
                  let bookId = null;
                  if (typeof borrow.book === 'string') {
                    bookId = borrow.book;
                  } else if (borrow.book && typeof borrow.book === 'object') {
                    bookId = borrow.book._id;
                  } else if (borrow.bookId) {
                    bookId = borrow.bookId;
                  }
                  
                  const bookTitle = borrow.book?.title || borrow.bookTitle || "Unknown Book";
                  
                  return (
                    <tr key={borrow._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{borrow.user?.name || "N/A"}</td>
                      <td className="px-4 py-2">{borrow.user?.email || "N/A"}</td>
                      <td className="px-4 py-2">{borrow.user?.mobile || "N/A"}</td>
                      <td className="px-4 py-2 font-medium">{bookTitle}</td>
                      <td className="px-4 py-2">{formatDateTime(borrow.borrowDate)}</td>
                      <td className="px-4 py-2">{formatDate(borrow.dueDate)}</td>
                      <td className="px-4 py-2">{borrow.returnDate ? formatDateTime(borrow.returnDate) : "Not Returned"}</td>
                      <td className="px-4 py-2">{getFineStatus(borrow.dueDate, borrow.returnDate, borrow.fine)}</td>
                      {filter !== "returned" && (
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleReturnClick(bookId, borrow.user?.email)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition flex items-center gap-1 mx-auto"
                          >
                            <img src={ReturnIcon} alt="Return" className="w-4 h-4" />
                            Return
                          </button>
                         </td>
                      )}
                     </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">
              {searchActive 
                ? `No results found for "${searchTerm}"` 
                : filter === "active" 
                  ? "No active borrows found!" 
                  : filter === "returned" 
                    ? "No returned books found!" 
                    : "No borrowing records found!"}
            </p>
          </div>
        )}
      </main>
      
      {returnBookPopup && returnData.bookId && (
        <ReturnBookPopup 
          bookId={returnData.bookId}
          email={returnData.email}
          onClose={() => {
            setReturnData({ bookId: "", email: "" });
            dispatch(toggleReturnBookPopup());
            dispatch(fetchAllBorrowedBooks());
          }}
        />
      )}
    </>
  );
}