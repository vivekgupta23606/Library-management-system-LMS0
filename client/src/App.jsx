import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/ForgotPassword'
import OTP from './Pages/OTP'
import ResetPassword from './Pages/ResetPassword'
import MyBorrowedBooks from './components/MyBorrowedBooks'
import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getUser } from './store/slices/authSlice'
import { getAllUsers } from './store/slices/userSlice'
import { fetchAllBorrowedBooks, fetchUserBorrowedBooks } from './store/slices/borrowSlice'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  // ✅ Skip getUser on reset password page
  const isResetPage = location.pathname.includes('/password/reset/');
  
  useEffect(() => {
    if (!isResetPage) {
      dispatch(getUser());
    }
  }, [dispatch, isResetPage]);
  
  useEffect(() => {
    if (isAuthenticated && user?.role === "User" && !isResetPage) {
      dispatch(fetchUserBorrowedBooks());  
    }
    
    if (isAuthenticated && user?.role === "Admin" && !isResetPage) {
      dispatch(getAllUsers()); 
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, isAuthenticated, user?.role, isResetPage]);
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/password/forgot' element={<ForgotPassword/>} />
        <Route path='/otp-verification/:email' element={<OTP/>} />
        <Route path='/password/reset/:token' element={<ResetPassword/>} />
        <Route path='/my-borrowed-books' element={<MyBorrowedBooks/>} />
      </Routes>
      <ToastContainer theme='dark' position="top-right" autoClose={3000} />
    </>
  )
}

export default App