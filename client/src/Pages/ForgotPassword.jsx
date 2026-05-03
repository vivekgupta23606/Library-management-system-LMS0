import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError, clearMessage } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import logo_with_title from "../assets/logo_with_textdata1.png";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(forgotPassword(email));
      
      if (result?.success) {
        toast.success(result.message || `Password reset link sent to ${email}`);
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Left Side - Brand Section */}
      <div className='hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <div className='flex justify-center mb-12'>
            <img src={logo_with_title} alt="logo" className='h-44 w-auto' />
          </div>
          <h2 className='text-3xl font-bold mb-4'>Forgot Password?</h2>
          <p className='text-gray-300 text-lg'>
            "Your premier digital library for borrowing and reading books!"
          </p>
          <div className="mt-12">
            <Link to="/login" className="text-gray-400 hover:text-white transition">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className='w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-8 min-h-screen md:min-h-0'>
        <div className='w-full max-w-md'>
          {/* Mobile Logo */}
          <div className='flex justify-center mb-8 md:hidden'>
            <img src={logo_with_title} alt="logo" className='h-24 w-auto' />
          </div>
          
          <div className='text-center mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Reset Password</h1>
            <p className='text-gray-500 mt-2 text-sm'>
              Enter your email to receive reset link
            </p>
          </div>
          
          <form onSubmit={handleForgotPassword} className='space-y-6'>
            <div>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                <input 
                  type='email' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder='Email Address' 
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                  autoComplete='email'
                  required
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>
            
            <button 
              type='submit' 
              className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2'
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
            
            {/* Mobile Back Link */}
            <div className='text-center md:hidden'>
              <Link to="/login" className="text-gray-600 hover:text-black transition inline-flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}