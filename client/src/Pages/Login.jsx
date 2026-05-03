import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, clearMessage } from '../store/slices/authSlice';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommitLogo from '../assets/logo1.png'
import logo_with_title from "../assets/logo_with_textdata1.png";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(login({ email, password }));
      console.log("Login result:", result);
      
      //  Check if login was successful
      if (result?.success) {
        toast.success(result.message || "Login successful!");
      } else if (result?.message) {
        //  Show error message if returned
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error in component:", error);
      //  Error already shown in slice, but fallback
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    if (message) {
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Left Side - Form */}
      <div className='w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-8 order-2 md:order-1'>
        <div className='w-full max-w-md'>
          <div className='flex justify-center mb-8 md:hidden'>
            <img src={CommitLogo} alt="logo" className='h-20 w-auto'/>
          </div>
          
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Welcome Back!</h1>
            <p className='text-gray-500'>Please enter your credentials to login</p>
          </div>
          
          <form onSubmit={handleLogin} className='space-y-5'>
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
            
            <div>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder='Password' 
                  className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                  autoComplete='current-password'
                  required
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className='text-right'>
              <Link to={"/password/forgot"} className='text-sm text-gray-600 hover:text-black hover:underline transition'>
                Forgot Password?
              </Link>
            </div>
            
            <div className='block md:hidden text-center pt-2'>
              <p className='text-sm text-gray-600'>
                New to our platform?{" "}
                <Link to={"/register"} className='text-black font-semibold hover:underline'>
                  Sign Up
                </Link>
              </p>
            </div>
            
            <button 
              type='submit' 
              className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 mt-2 flex items-center justify-center gap-2'
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Side - Brand Section */}
      <div className='hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px] order-1 md:order-2'>
        <div className='text-center'>
          <div className='flex justify-center mb-12'>
            <img src={logo_with_title} alt="logo" className='h-44 w-auto'/>
          </div>
          <h2 className='text-3xl font-bold mb-4'>Welcome to Library</h2>
          <p className='text-gray-300 mb-8'>Manage your books, track borrows, and more!</p>
          <p className='text-gray-400 mb-4'>New to our platform?</p>
          <Link 
            to={"/register"} 
            className="inline-block border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}