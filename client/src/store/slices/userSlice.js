import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        fetchAllUserRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchAllUserSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUserFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addNewAdminRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        addNewAdminSuccess(state, action) {
            state.loading = false;
            state.message = action.payload?.message || "Admin added successfully";
        },
        addNewAdminFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        clearMessage(state) {
            state.message = null;
        },
    }
});

export const { clearError, clearMessage } = userSlice.actions;

export const getAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUserRequest());
    try {
        const token = localStorage.getItem('token');
        
        const res = await axios.get(`${API_URL}/api/v1/user/all`, {
            withCredentials: false,
            headers: { 
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        dispatch(userSlice.actions.fetchAllUserSuccess(res.data.users));
        return res.data;
    } catch (err) {
        dispatch(userSlice.actions.fetchAllUserFailed(
            err.response?.data?.message || "Failed to fetch users"
        ));
        toast.error(err.response?.data?.message || "Failed to fetch users");
    }
};
export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    try {
        const token = localStorage.getItem('token');
        
        console.log("Sending FormData to backend...");
        
        const res = await axios.post(`${API_URL}/api/v1/user/add/new-admin`, data, {
            withCredentials: false,
            headers: { 
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'multipart/form-data'  // ✅ Important!
            },
        });
        
        console.log("Response:", res.data);
        
        dispatch(userSlice.actions.addNewAdminSuccess(res.data));
        return res.data;
    } catch (err) {
        console.error("Error response:", err.response?.data);
        const errorMsg = err.response?.data?.message || "Failed to add admin";
        dispatch(userSlice.actions.addNewAdminFailed(errorMsg));
        throw err;
    }
};

export default userSlice.reducer;