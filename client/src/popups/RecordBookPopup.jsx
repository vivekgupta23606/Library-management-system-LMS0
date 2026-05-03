import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { recordBorrowBook } from '../store/slices/borrowSlice';
import { toggleRecordBookPopup } from '../store/slices/popUpSlice';
import { toast } from 'react-toastify';

export default function RecordBookPopup({ bookId }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const hasSubmitted = useRef(false);
  const initialBookId = useRef(bookId);

  useEffect(() => {
    if (bookId && initialBookId.current !== bookId) {
      initialBookId.current = bookId;
    }
  }, [bookId]);

  if (!initialBookId.current) {
    console.log("RecordBookPopup - No bookId, returning null");
    return null;
  }

  const handleRecordBook = async (e) => {
    e.preventDefault();
    
    if (hasSubmitted.current) {
      console.log("Already submitting...");
      return;
    }
    
    if (!email) {
      toast.error("Please enter user email");
      return;
    }
    
    hasSubmitted.current = true;
    setLoading(true);
    
    console.log("Recording book - ID:", initialBookId.current, "Email:", email);
    
    try {
      await dispatch(recordBorrowBook(email, initialBookId.current));
      dispatch(toggleRecordBookPopup());
    } catch (error) {
      console.error("Record error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        hasSubmitted.current = false;
      }, 1000);
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
      <div className='w-full md:w-1/3 bg-white rounded-lg shadow-lg lg:w-1/3'>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-4'>Record Book</h3>
          <form onSubmit={handleRecordBook}>
            <div className='mb-4'>
              <label className='block text-gray-900 font-medium'>User Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Borrower's Email" 
                className='w-full px-4 py-2 border-2 border-black rounded-md' 
                required
                disabled={loading}
              />
            </div>
            <div className='flex justify-end space-x-4'>
              <button 
                className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300' 
                type='button' 
                onClick={() => dispatch(toggleRecordBookPopup())}
                disabled={loading}
              >
                Close
              </button>
              <button 
                className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50' 
                type='submit'
                disabled={loading}
              >
                {loading ? "Recording..." : "Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}