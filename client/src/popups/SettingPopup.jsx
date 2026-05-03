import React, { useState } from 'react'
import closeIcon from '../assets/close.png'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword } from '../store/slices/authSlice'
import SettingIcon from "../assets/settingIcon.png";
import { toggleSettingPopup } from '../store/slices/popUpSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function SettingPopup() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    
    if (newPassword.length > 16) {
      toast.error("New password must be less than 16 characters");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    };
    
    try {
      const result = await dispatch(updatePassword(data));
      
      // ✅ ONLY ONE TOAST HERE
      if (result?.payload?.success || result?.success) {
        toast.success("Password updated successfully!");
        dispatch(toggleSettingPopup());
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (result?.payload?.message) {
        toast.error(result.payload.message);
      } else if (result?.message) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Update password error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 p-4 flex items-center justify-center z-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg'>
        <div className='p-6'>
          <header className='flex justify-between items-center mb-5 pb-4 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className="bg-gray-300 p-2 rounded-lg">
                <img src={SettingIcon} alt="Setting" className="w-5 h-5"/>
              </div>
              <h3 className='text-lg font-bold'>Change Password</h3>
            </div>
            <button 
              onClick={() => dispatch(toggleSettingPopup())}
              className="text-gray-500 hover:text-gray-700"
            >
              <img src={closeIcon} alt="Close" className="w-5 h-5"/>
            </button>
          </header>

          <form onSubmit={handleUpdatePassword}>
            {/* Current Password */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2 text-sm'>
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Enter current password" 
                  className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2 text-sm'>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="New password (8-16 characters)" 
                  className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                  minLength="8"
                  maxLength="16"
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className='text-xs text-gray-400 mt-1'>Password must be 8-16 characters</p>
            </div>

            {/* Confirm Password */}
            <div className='mb-6'>
              <label className='block text-gray-700 font-medium mb-2 text-sm'>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  placeholder="Confirm new password" 
                  className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-3'>
              <button
                type="button"
                onClick={() => dispatch(toggleSettingPopup())}
                className='flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm'
                disabled={isSubmitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className='flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 text-sm'
              >
                {isSubmitting || loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}