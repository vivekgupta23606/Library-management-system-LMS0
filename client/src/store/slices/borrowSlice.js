import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleRecordBookPopup } from "./popUpSlice";
import { API_URL } from "../../config";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
    
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const { clearError, clearMessage } = borrowSlice.actions;

// Get User's Borrowed Books
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.get(`${API_URL}/api/v1/borrow/my-borrowed-books`, {
      withCredentials: false,
      headers: { 
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to fetch borrowed books";
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(errorMsg));
    toast.error(errorMsg);
  }
};

// Get All Borrowed Books (Admin)
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.get(`${API_URL}/api/v1/borrow/borrowed-books-by-users`, {
      withCredentials: false,
      headers: { 
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks));
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to fetch all borrowed books";
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(errorMsg));
    toast.error(errorMsg);
  }
};

// Record Borrow Book
export const recordBorrowBook = (email, id) => async (dispatch) => {
  try {
    dispatch(borrowSlice.actions.recordBookRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.post(
      `${API_URL}/api/v1/borrow/record-borrow-book/${id}`,
      { email },
      {
        withCredentials: false,
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json' 
        },
      }
    );
    
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
    toast.success(res.data.message);
    dispatch(toggleRecordBookPopup());
    return res.data;
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || "Failed to record borrow";
    dispatch(borrowSlice.actions.recordBookFailed(errorMsg));
    toast.error(errorMsg);
    throw err;
  }
};

// Return Book
export const returnBook = (data) => async (dispatch) => {
  try {
    dispatch(borrowSlice.actions.returnBookRequest());
    
    let email, bookId;
    
    if (typeof data === 'object' && data !== null) {
      email = data.email;
      bookId = data.bookId;
    } else {
      console.error("❌ returnBook called with wrong format");
      throw new Error("Invalid function call format");
    }
    
    if (!bookId || bookId === 'undefined') {
      throw new Error("Invalid book ID. Please refresh and try again.");
    }
    
    const token = localStorage.getItem('token');
    
    const res = await axios.put(
      `${API_URL}/api/v1/borrow/return-borrowed-book/${bookId}`,
      { email },
      {
        withCredentials: false,
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json' 
        },
      }
    );
    
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
    return res.data;
    
  } catch (err) {
    console.error("❌ returnBook error:", err);
    const errorMsg = err.response?.data?.message || err.message || "Failed to return book";
    dispatch(borrowSlice.actions.returnBookFailed(errorMsg));
    throw err;
  }
};
export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;