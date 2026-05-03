import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBorrowedBooks } from '../store/slices/borrowSlice';
import Header from '../Layout/Header';

export default function BorrowHistory() {
  const dispatch = useDispatch();
  const { userBorrowedBooks, loading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
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

  const activeBooks = userBorrowedBooks?.filter(b => !b.returned) || [];
  const returnedBooks = userBorrowedBooks?.filter(b => b.returned) || [];

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
      <h2 className="text-2xl font-semibold mb-6">My Borrow History</h2>
      
      {/* Active Books */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Currently Borrowed ({activeBooks.length})</h3>
        {activeBooks.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {activeBooks.map((book, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{book.bookTitle}</td>
                    <td className="px-4 py-2">{formatDate(book.borrowedDate)}</td>
                    <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No active borrows</p>
        )}
      </div>
      
      {/* Returned Books */}
      <div>
        <h3 className="text-lg font-medium mb-3">Returned Books ({returnedBooks.length})</h3>
        {returnedBooks.length > 0 ? (
          <div className="overflow-auto bg-white rounded-md shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Returned Date</th>
                </tr>
              </thead>
              <tbody>
                {returnedBooks.map((book, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{book.bookTitle}</td>
                    <td className="px-4 py-2">{formatDate(book.borrowedDate)}</td>
                    <td className="px-4 py-2">{formatDate(book.returnedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No returned books yet</p>
        )}
      </div>
    </main>
  );
}