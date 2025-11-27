import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    onlineUsers:[],
    isSigningUp:false,
    isLoggingIng:false,
    isCheckingAuth: true,
    isUpdatingProfile: false,


    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
          set({authUser:null})  
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
        set({isSignup: true})
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})
            toast.success("Account Created Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        set({isLoggingIng: true})
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data})
            toast.success("Logged in Successfully")
        } catch (error) {
            toast.error(error.response.message || "Invaild Credintials")
        }
    }, 

    logout: async () => {
       try {
         await axiosInstance.post("/auth/logout")
         set({authUser:null})
         toast.success("Logged Out Successfully")
       } catch (error) {
        toast.error(error.response.data.message)
       }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser: res.data})
            toast.success("Profile Updated Successfully")
        } catch (error) {
           console.log(error, "error in updating profile function");
            toast.error(error.response.message || "Failed To Update Profile")
        }
    }
}))