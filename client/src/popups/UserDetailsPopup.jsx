// src/popups/UserDetailsPopup.jsx

import React from 'react';
import { X, Phone, Mail, User, Calendar } from 'lucide-react';

export default function UserDetailsPopup({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <img 
              src={user.avatar?.url || "https://via.placeholder.com/100"} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            {/* ✅ Mobile Number Display */}
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Mobile Number</p>
                <p className="font-medium">{user.mobile || "Not provided"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          {/* Borrowed Books Count */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total Books Borrowed: <span className="font-bold">{user.borrowedBooks?.length || 0}</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-end p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}