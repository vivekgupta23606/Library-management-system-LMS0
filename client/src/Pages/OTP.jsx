import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom'
import { otpverification, resetAuthSlice } from '../store/slices/authSlice';
import { toast } from "react-toastify";
import CommitLogo from '../assets/logo1.png'
import logo_with_title from "../assets/logo_with_textdata1.png";
import { Loader2 } from "lucide-react";

export default function OTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);
  
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!otp || otp.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(otpverification(email, otp));
      console.log("OTP verification result:", result);
      
      if (result?.success) {
        toast.success("Account verified successfully!");
      }
    } catch (error) {
      console.error("OTP error:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error, dispatch]);

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex flex-col justify-center md:flex-row h-screen'>
      <div className='w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative'>
        <Link to={'/register'} className='border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end'>
          Back
        </Link>
        <div className='max-w-sm w-full'>
          <div className='flex justify-center mb-12'>
            <div className='rounded-full flex items-center justify-center'>
              <img src={CommitLogo} alt="logo" className='h-24 w-auto'/>
            </div>
          </div>
          <h1 className='text-4xl font-medium text-center mb-12 overflow-hidden'>Check Your Mailbox</h1>
          <p className='text-gray-800 text-center mb-12'>Please enter the OTP to proceed</p>
          <form onSubmit={handleOtpVerification}>
            <div className='mb-4'>
              <input 
                type='number' 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder='OTP' 
                className='w-full px-4 py-3 border border-black rounded-md focus:outline-none'
                maxLength="5"
              />
            </div>
            <button 
              type='submit' 
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-600 transition mt-4 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "VERIFY"
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className='hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]'>
        <div className='text-center h-[400px]'>
          <div className='flex justify-center mb-12'>
            <img src={logo_with_title} alt="logo" className='mb-12 h-44 w-auto'/>
          </div>
          <p className='text-gray-300 mb-12'>New to our platform? Sign up now.</p>
          <Link to={"/register"} className="w-full bg-black text-white py-3 rounded-md hover:bg-white transition mt-4 font-semibold disabled:opacity-50 px-8 hover:text-black border-2 border-white">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}