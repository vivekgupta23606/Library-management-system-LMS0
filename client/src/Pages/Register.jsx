import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, clearError, clearMessage, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo_with_title from "../assets/logo_with_textdata1.png";
import CommitLogo from '../assets/logo1.png';
import { Phone, Mail, Lock, User, Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!mobile) {
      toast.error("Please enter mobile number");
      return;
    }
    
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setIsSubmitting(true);
    
    const userData = {
      name: name,
      email: email,
      mobile: mobile,
      password: password
    };
    
    console.log("Sending registration data:", userData);
    const result = await dispatch(register(userData));
    
    if (result?.success) {
      navigateTo(`/otp-verification/${email}`);
    }
    
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [message, error, dispatch, navigateTo, email]);

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* Left Side */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>
          <p className="text-gray-300 mb-12">Already have Account? Sign in now.</p>
          <Link to={'/login'} className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition">
            SIGN IN
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
              <h3 className="font-medium text-4xl overflow-hidden">Sign Up</h3>
              <img src={CommitLogo} alt="logo" className="h-auto w-24 object-cover" />
            </div>
          </div>
          <p className="text-gray-800 text-center mb-12">Please provide information to sign up.</p>
          
          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}  
                  placeholder="Full Name" 
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-md focus:outline-none"
                  autoComplete="name"
                  required
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}  
                  placeholder="Email Address" 
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-md focus:outline-none"
                  autoComplete="email"
                  required
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>
            
            {/* Mobile */}
            <div className="mb-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)}  
                  placeholder="Mobile Number (10 digits)" 
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-md focus:outline-none"
                  autoComplete="tel"
                  required
                  disabled={isSubmitting || loading}
                  maxLength="10"
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="mb-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}  
                  placeholder="Password (min 6 characters)" 
                  className="w-full pl-10 pr-4 py-3 border border-black rounded-md focus:outline-none"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting || loading}
                  minLength="6"
                />
              </div>
            </div>
            
            <div className="block md:hidden font-semibold mt-5">
              <p>Already have Account? 
                <Link to={'/login'} className="text-sm text-gray-500 hover:underline"> Sign In</Link>
              </p>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-600 transition mt-4 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}