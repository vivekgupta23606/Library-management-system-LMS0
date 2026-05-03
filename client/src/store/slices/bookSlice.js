import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
    book: null,
  },
  reducers: {
    getBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    getBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.books.push(action.payload.book);
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    deleteBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.books = state.books.filter(book => book._id !== action.payload.bookId);
    },
    deleteBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    resetBookSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const { 
  clearError, 
  clearMessage,
  resetBookSlice 
} = bookSlice.actions;

// ==================== GET ALL BOOKS ====================
export const getAllBooks = () => async (dispatch) => {
  try {
    dispatch(bookSlice.actions.getBooksRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.get(`${API_URL}/api/v1/book/all`, {
      withCredentials: false,
      headers: { 
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Get books response:", res.data);
    dispatch(bookSlice.actions.getBooksSuccess(res.data.books));
    
  } catch (error) {
    console.error("Get books error:", error);
    const errorMsg = error.response?.data?.message || "Failed to fetch books";
    dispatch(bookSlice.actions.getBooksFailed(errorMsg));
    toast.error(errorMsg);
  }
};

// ==================== ADD BOOK ====================
export const addBook = (data) => async (dispatch) => {
  try {
    dispatch(bookSlice.actions.addBookRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.post(
      `${API_URL}/api/v1/book/admin/add`,
      data,
      {
        withCredentials: false,
        headers: { 
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json' 
        },
      }
    );
    
    console.log("Add book response:", res.data);
    dispatch(bookSlice.actions.addBookSuccess(res.data));
    
    // ❌ REMOVE THIS TOAST - component will handle
    // toast.success(res.data.message || "Book added successfully");
    
    return res.data;
    
  } catch (error) {
    console.error("Add book error:", error);
    const errorMsg = error.response?.data?.message || "Failed to add book";
    dispatch(bookSlice.actions.addBookFailed(errorMsg));
    
    // ❌ REMOVE THIS TOAST - component will handle
    // toast.error(errorMsg);
    
    return error.response?.data;
  }
};

// ==================== DELETE BOOK ====================
export const deleteBook = (id) => async (dispatch) => {
  try {
    dispatch(bookSlice.actions.deleteBookRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.delete(
      `${API_URL}/api/v1/book/delete/${id}`,
      { 
        withCredentials: false,
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      }
    );
    
    console.log("Delete book response:", res.data);
    dispatch(bookSlice.actions.deleteBookSuccess({ 
      message: res.data.message, 
      bookId: id 
    }));
    
    toast.success(res.data.message || "Book deleted successfully");
    return res.data;
    
  } catch (error) {
    console.error("Delete book error:", error);
    const errorMsg = error.response?.data?.message || "Failed to delete book";
    dispatch(bookSlice.actions.deleteBookFailed(errorMsg));
    toast.error(errorMsg);
    return error.response?.data;
  }
};

export default bookSlice.reducer;