import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { returnBook, fetchAllBorrowedBooks } from '../store/slices/borrowSlice';
import { toggleReturnBookPopup } from '../store/slices/popUpSlice';
import { toast } from 'react-toastify';

export default function ReturnBookPopup({ bookId, email, onClose }) {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }
    console.log("📦 ReturnBookPopup received:", { bookId, email });
  }, [email, bookId]);

  if (!bookId) {
    console.warn("⚠️ ReturnBookPopup: No bookId, returning null");
    return null;
  }

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cleanEmail = userEmail.toLowerCase().trim();
    
    if (!cleanEmail) {
      toast.error("Please enter user email");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await dispatch(returnBook({ email: cleanEmail, bookId }));
      
      console.log("📥 Return result:", result);
      
      if (result?.payload?.success || result?.success) {
        const responseData = result?.payload || result;
        const fine = responseData.data?.fine || 0;
        const daysLate = responseData.data?.daysLate || 0;
        
        // ✅ ONLY ONE TOAST HERE
        if (fine > 0) {
          toast.warning(`⚠️ Book is OVERDUE by ${daysLate} day${daysLate > 1 ? 's' : ''}!\n💰 Late Fine: ₹${fine}`);
        } else {
          toast.success(`✅ Book returned successfully on time!`);
        }
        
        if (onClose) {
          onClose();
        } else {
          dispatch(toggleReturnBookPopup());
        }
        
        dispatch(fetchAllBorrowedBooks());
      }
    } catch (error) {
      console.error("❌ Return error:", error);
      toast.error(error.response?.data?.message || "Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4 pb-3 border-b border-gray-200'>
            <h3 className='text-xl font-bold'>Return Book</h3>
            <button 
              onClick={() => onClose ? onClose() : dispatch(toggleReturnBookPopup())}
              className='text-gray-500 hover:text-gray-700 text-2xl'
            >
              &times;
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Book ID</p>
            <p className="font-mono text-sm break-all">{bookId}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2'>
                User Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
                placeholder="User's Email Address" 
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                required
                disabled={loading}
              />
            </div>
            
            <div className='flex gap-3 mt-6'>
              <button
                type="button"
                onClick={() => onClose ? onClose() : dispatch(toggleReturnBookPopup())}
                className='flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition'
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className='flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50'
              >
                {loading ? "Processing..." : "Confirm Return"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}