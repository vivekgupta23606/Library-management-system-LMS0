import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    otpverificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpverificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    otpverificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    getUserFailed(state, action) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    // FIXED: No user, no isAuthenticated on reset
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      //  REMOVED: state.user and state.isAuthenticated
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
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
  resetAuthSlice, 
  clearError, 
  clearMessage 
} = authSlice.actions;

const getTokenFromCookie = () => {
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

// ==================== REGISTER ====================
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.registerRequest());
    
    const res = await axios.post(
      `${API_URL}/api/v1/auth/register`, 
      {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("Register response:", res.data);
    dispatch(authSlice.actions.registerSuccess(res.data));
    return res.data;
    
  } catch (error) {
    console.error("Register error:", error);
    dispatch(authSlice.actions.registerFailed(
      error.response?.data?.message || "Registration failed"
    ));
  }
};

// ==================== OTP VERIFICATION ====================
export const otpverification = (email, otp) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.otpverificationRequest());
    const res = await axios.post(
      `${API_URL}/api/v1/auth/verify-otp`,
      { email, otp },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(authSlice.actions.otpverificationSuccess(res.data));
  } catch (error) {
    dispatch(authSlice.actions.otpverificationFailed(
      error.response?.data?.message || "OTP verification failed"
    ));
  }
};

// ==================== LOGIN ====================
export const login = (data) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.loginRequest());
    
    console.log("Sending login request for:", data.email);
    
    const res = await axios.post(
      `${API_URL}/api/v1/auth/login`, 
      {
        email: data.email,
        password: data.password
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("Login response:", res.data);
    
    if (res.data.success && res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("Token stored in localStorage");
    }
    
    if (res.data.success) {
      dispatch(authSlice.actions.loginSuccess(res.data));
      await dispatch(getUser());
    }
    
    return res.data;
    
  } catch (error) {
    console.error("Login error:", error.response?.data);
    
    const errorMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
    
    dispatch(authSlice.actions.loginFailed(errorMsg));
    
    // ❌ REMOVE THIS TOAST - component will handle
    // toast.error(errorMsg);
    
    return { success: false, message: errorMsg };
  }
};

// ==================== LOGOUT ====================
export const logout = () => async (dispatch) => {
  try {
    dispatch(authSlice.actions.logoutRequest());
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    dispatch(authSlice.actions.logoutSuccess("Logged out successfully"));
    
    await axios.get(`${API_URL}/api/v1/auth/logout`, {
      withCredentials: true,
    }).catch(err => console.log("Logout API error:", err));
    
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(authSlice.actions.logoutSuccess("Logged out successfully"));
  }
};

// ==================== GET USER ====================
export const getUser = () => async (dispatch) => {
  let token = localStorage.getItem('token');
  
  if (!token) {
    const match = document.cookie.match(/token=([^;]+)/);
    token = match ? match[1] : null;
  }
  
  if (!token) {
    console.log("No valid token found, skipping getUser");
    dispatch(authSlice.actions.getUserFailed(null));
    return;
  }
  
  try {
    dispatch(authSlice.actions.getUserRequest());
    
    const res = await axios.get(`${API_URL}/api/v1/auth/me`, {
      withCredentials: true,  //  Change back to true
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Get user response:", res.data);
    
    if (res.data.success && res.data.user) {
      dispatch(authSlice.actions.getUserSuccess(res.data));
      //  Store user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      dispatch(authSlice.actions.getUserFailed(null));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    
  } catch (error) {
    console.log("Get user error:", error.response?.status);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    dispatch(authSlice.actions.getUserFailed(null));
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.forgotPasswordRequest());
    
    console.log("📤 Sending email:", email);
    
    const res = await axios.post(
      `${API_URL}/api/v1/auth/password/forgot`,
      { email },
      {
        withCredentials: true,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );
    
    console.log("📥 Response:", res.data);
    dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
    return res.data;
  } catch (error) {
    console.error(" Error:", error.response?.data);
    dispatch(authSlice.actions.forgotPasswordFailed(
      error.response?.data?.message || "Failed to send reset email"
    ));
    throw error;
  }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = (data, token) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.resetPasswordRequest());
    
    console.log("📤 Sending reset password request...");
    
    const res = await axios.put(
      `${API_URL}/api/v1/auth/password/reset/${token}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    
    console.log("📥 Reset password response:", res.data);
    
    dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    return res.data;
    
  } catch (error) {
    console.error(" Reset password error:", error.response?.data?.message);
    const errorMsg = error.response?.data?.message || "Failed to reset password";
    dispatch(authSlice.actions.resetPasswordFailed(errorMsg));
    throw error;
  }
};

// ==================== UPDATE PASSWORD ====================
export const updatePassword = (data) => async (dispatch) => {
  try {
    dispatch(authSlice.actions.updatePasswordRequest());
    
    const token = localStorage.getItem('token');
    
    const res = await axios.put(
      `${API_URL}/api/v1/auth/password/update`,
      data,
      {
        withCredentials: true,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ''
        },
      }
    );
    
    dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    return res.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to update password";
    dispatch(authSlice.actions.updatePasswordFailed(errorMsg));
    throw error;
  }
};

export const resetAuthState = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export default authSlice.reducer;