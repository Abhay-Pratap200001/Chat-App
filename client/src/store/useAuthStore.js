import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance, BASE_URL } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      onlineUsers: [],
      isSigningUp: false,
      isLoggingIn: false,
      isCheckingAuth: true,
      isUpdatingProfile: false,
      socket: null,

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account Created Successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in Successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message || "Invalid Credentials");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged Out Successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile Updated Successfully");
        } catch (error) {
          console.log(error, "error in updating profile function");
          toast.error(error.response?.data?.message || "Failed To Update Profile");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(BASE_URL, {
          withCredentials: true,
          query: { userId: authUser._id },
        });

        newSocket.connect();
        set({ socket: newSocket });

        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage", // persists authUser in localStorage
      partialize: (state) => ({ authUser: state.authUser }), // only persist authUser
    }
  )
);
