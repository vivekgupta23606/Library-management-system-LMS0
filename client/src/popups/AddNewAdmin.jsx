import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAdmin } from '../store/slices/userSlice'
import { toggleAddNewAdminPopup } from '../store/slices/popUpSlice';
import { toast } from 'react-toastify';
import keyIcon from '../assets/key.jpg'
import close from '../assets/close.png'
import placeHolder from '../assets/placeHolder.jpg'

export default function AddNewAdmin() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPrev, setAvatarPrev] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PNG, JPG, JPEG, or WEBP image only");
      e.target.value = '';
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB allowed");
      e.target.value = '';
      return;
    }
    
    setAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPrev(previewUrl);
    toast.success(`✓ ${file.name} selected`);
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    console.log("=== DEBUG ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Mobile:", mobile);
    console.log("Avatar file:", avatar);
    
    if (!name || !email || !mobile || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (!avatar) {
      toast.error("Please select an avatar image");
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("password", password);
    formData.append("avatar", avatar);
    
    try {
      const result = await dispatch(addNewAdmin(formData));
      console.log("Result:", result);
      
      if (result?.success) {
        toast.success("Admin added successfully!");
        dispatch(toggleAddNewAdminPopup());
        // Reset form
        setName("");
        setEmail("");
        setMobile("");
        setPassword("");
        setAvatar(null);
        setAvatarPrev(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result?.message || "Failed to add admin");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to add admin";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (avatarPrev) {
      URL.revokeObjectURL(avatarPrev);
    }
    dispatch(toggleAddNewAdminPopup());
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <header className='flex justify-between items-center mb-5 pb-4 border-b border-gray-200 sticky top-0 bg-white'>
            <div className='flex items-center gap-3'>
              <div className="bg-gray-300 p-2 rounded-lg">
                <img src={keyIcon} alt="Key-Icon" className="w-5 h-5"/>
              </div>
              <h3 className='text-lg font-bold'>Add New Admin</h3>
            </div>
            <img 
              src={close} 
              alt="Close" 
              onClick={handleClose}  
              className="w-5 h-5 cursor-pointer"
            />
          </header>

          <form onSubmit={handleAddNewAdmin}>
            {/* Avatar Section */}
            <div className='flex flex-col items-center mb-5'>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer group"
              >
                <img 
                  src={avatarPrev || placeHolder} 
                  alt="Avatar" 
                  className='w-24 h-24 rounded-full object-cover border-2 border-gray-300 hover:border-black transition group-hover:opacity-80'
                />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  name="avatar"
                  accept='image/png,image/jpeg,image/jpg,image/webp' 
                  className='hidden' 
                  onChange={handleImageChange} 
                />
              </div>
              <p className='text-xs text-gray-500 mt-2'>Click on image to upload avatar (Max 5MB)</p>
              {avatar && (
                <p className='text-xs text-green-600 mt-1'>✓ {avatar.name}</p>
              )}
            </div>

            {/* Name */}
            <div className='mb-3'>
              <label className='block text-gray-700 font-medium mb-1 text-sm'>Full Name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter full name" 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm'
                required
              />
            </div>

            {/* Email */}
            <div className='mb-3'>
              <label className='block text-gray-700 font-medium mb-1 text-sm'>Email Address *</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email address" 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm'
                required
              />
            </div>

            {/* Mobile Number */}
            <div className='mb-3'>
              <label className='block text-gray-700 font-medium mb-1 text-sm'>Mobile Number (10 digits) *</label>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)} 
                placeholder="Enter 10-digit mobile number" 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm'
                maxLength="10"
                required
              />
            </div>

            {/* Password */}
            <div className='mb-5'>
              <label className='block text-gray-700 font-medium mb-1 text-sm'>Password *</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password (min 8 characters)" 
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm'
                required
                minLength="8"
              />
              <p className='text-xs text-gray-400 mt-1'>Password must be 8-16 characters</p>
            </div>

            {/* Buttons */}
            <div className='flex gap-3 pt-2'>
              <button
                type="button"
                onClick={handleClose}
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
                {(isSubmitting || loading) ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}