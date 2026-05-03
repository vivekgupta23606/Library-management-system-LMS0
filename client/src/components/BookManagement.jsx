// src/components/BookManagement.jsx - Complete with filters

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/slices/authSlice"; 
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { getAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import BookA from '../assets/Book1.png'
import NoteBook from '../assets/NoteBook.png'
import Header from "../Layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import { Filter, X, GraduationCap, Layers, Calendar } from "lucide-react";

export default function BookManagement() {
  const dispatch = useDispatch();
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup,
  );
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    course: "All",
    branch: "All",
    semester: "All"
  });
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // Courses list
  const courses = [
    "All", "BTech", "MTech", "BCA", "MCA", "BSc", "MSc", 
    "BBA", "MBA", "PhD", "Diploma", "B.Pharma", "M.Pharma"
  ];

  // Get branches based on selected course
  const getBranches = () => {
    const course = filters.course;
    if (course === "Diploma") {
      return ["All", "Diploma CS", "Diploma IT", "Diploma EC", "Diploma EE", "Diploma ME"];
    }
    if (course === "B.Pharma" || course === "M.Pharma") {
      return ["All", "Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Pharmacognosy", "Clinical Pharmacy", "Pharmacy Practice"];
    }
    return ["All", "CSE", "CS", "IT", "ECE", "EE", "ME", "CE", "Civil", "Mechanical", "Electrical", "Electronics"];
  };

  const branches = getBranches();
  const semesters = ["All", 1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
    dispatch(getAllBooks());
    if (user?.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log("BookManagement - User updated:", user);
  }, [user]);

  const [readBook, setReadBook] = useState({});
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState(null);
  
  const openRecordBookPopup = (bookId) => {
    console.log("📖 Opening record popup for book ID:", bookId);
    if (!bookId) {
      toast.error("Invalid book ID");
      return;
    }
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  useEffect(() => {
    if (!recordBookPopup) {
      setBorrowBookId(null);
    }
  }, [recordBookPopup]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      dispatch(getAllBooks());
      if (user?.role === "Admin") {
        dispatch(fetchAllBorrowedBooks());
      }
      dispatch(resetBorrowSlice());
      dispatch(resetBookSlice());
    }
    if (error || borrowSliceError) {
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [
    message,
    borrowSliceMessage,
    dispatch,
    error,
    borrowSliceError,
    user?.role,
  ]);

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  // Apply all filters
  const getFilteredBooks = () => {
    let filtered = [...(books || [])];
    
    // Search filter
    if (searchedKeyword) {
      filtered = filtered.filter(book => 
        book.title?.toLowerCase().includes(searchedKeyword) ||
        book.author?.toLowerCase().includes(searchedKeyword) ||
        book.subject?.toLowerCase().includes(searchedKeyword)
      );
    }
    
    // Course filter
    if (filters.course && filters.course !== "All") {
      filtered = filtered.filter(book => book.course === filters.course);
    }
    
    // Branch filter
    if (filters.branch && filters.branch !== "All") {
      filtered = filtered.filter(book => book.branch === filters.branch);
    }
    
    // Semester filter
    if (filters.semester && filters.semester !== "All") {
      filtered = filtered.filter(book => book.semester === parseInt(filters.semester));
    }
    
    return filtered;
  };

  const filteredBooks = getFilteredBooks();
  const activeFilterCount = [
    filters.course !== "All", 
    filters.branch !== "All", 
    filters.semester !== "All"
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ course: "All", branch: "All", semester: "All" });
    setSearchedKeyword("");
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-500"
              >
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                  +
                </span>
                Add Book
              </button>
            )}
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, author, subject..."
                className="w-full sm:w-72 border p-2 pl-8 border-gray-300 rounded-md"
                value={searchedKeyword}
                onChange={handleSearch}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 ${
                showFilters ? "bg-gray-100 border-black" : "border-gray-300"
              }`}
            >
              <Filter size={18} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800"
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Filter Books</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Course Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <GraduationCap size={14} /> Course
                </label>
                <select
                  value={filters.course}
                  onChange={(e) => setFilters({...filters, course: e.target.value, branch: "All"})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                >
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Layers size={14} /> Branch
                </label>
                <select
                  value={filters.branch}
                  onChange={(e) => setFilters({...filters, branch: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                >
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar size={14} /> Semester
                </label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                >
                  {semesters.map(s => <option key={s} value={s}>{s === "All" ? "All Semesters" : `Semester ${s}`}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.course !== "All" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Course: {filters.course}</span>
            )}
            {filters.branch !== "All" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Branch: {filters.branch}</span>
            )}
            {filters.semester !== "All" && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Semester: {filters.semester}</span>
            )}
          </div>
        )}
        
        {filteredBooks.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Branch</th>
                  <th className="px-4 py-2 text-left">Sem</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-left">Quantity</th>
                  )}
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  {isAuthenticated && user?.role === "Admin" && (
                    <th className="px-4 py-2 text-center">Record Book</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.subject || "N/A"}</td>
                    <td className="px-4 py-2">{book.course || "BTech"}</td>
                    <td className="px-4 py-2">{book.branch || "CSE"}</td>
                    <td className="px-4 py-2 text-center">
                      {book.year ? `${book.year} Year` : (book.semester ? `Sem ${book.semester}` : "-")}
                    </td>
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2 text-center">{book.quantity}</td>
                    )}
                    <td className="px-4 py-2">{`Rs ${book.price}`}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        book.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {book.availability ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    {isAuthenticated && user?.role === "Admin" && (
                      <td className="px-4 py-2">
                        <div className="flex space-x-2 justify-center">
                          <img 
                            src={BookA} 
                            alt="View" 
                            className="w-7 h-7 cursor-pointer hover:opacity-70" 
                            onClick={() => openReadPopup(book._id)}
                          />
                          <img 
                            src={NoteBook} 
                            alt="Record" 
                            className="w-7 h-7 cursor-pointer hover:opacity-70" 
                            onClick={() => openRecordBookPopup(book._id)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No books match your filters!</p>
            {(activeFilterCount > 0 || searchedKeyword) && (
              <button onClick={clearFilters} className="mt-3 text-blue-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </main>
      
      {addBookPopup && <AddBookPopup/>}
      {readBookPopup && <ReadBookPopup book={readBook}/>}
      {recordBookPopup && borrowBookId && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
}