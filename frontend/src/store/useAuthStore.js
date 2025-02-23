import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create( (set,get) => ({
	authUser:null,
	isSigningUp:false,
	isLoggingIn:false,
	isUpdatingProfile: false,
	
	isCheckingAuth:true,
	onlineUsers: [],
	socket:null,
	
	checkAuth: async () => {
		try {
		  const res = await axiosInstance.get("/auth/check");

		  set({ authUser: res.data });
		  get().connectSocket();
		} catch (error) {
		  console.log("Error in checkAuth:", error);
		  set({ authUser: null });
		} finally {
		  set({ isCheckingAuth: false });
		}
	},
	
	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const resp = await axiosInstance.post("/auth/signup", data);
			set({ authUser: resp.data });
			toast.success("Account registered successfully!");
			get().connectSocket();
		} catch (error) {
			// Verbose error logging
			if (error.response) {
				// Server responded with an error
				console.error("Error Response Data:", error.response.data);
				console.error("Error Response Status:", error.response.status);
				console.error("Error Response Headers:", error.response.headers);
				toast.error(`Error: ${error.response.data.message || "Something went wrong!"}`);
			} else if (error.request) {
				// Request was made but no response received
				console.error("Error Request Data:", error.request);
				toast.error("No response received from the server.");
			} else {
				// Something went wrong in setting up the request
				console.error("Error Message:", error.message);
				toast.error(`Error: ${error.message}`);
			}
		} finally {
			set({ isSigningUp: false });
		}
	},
	
	logout: async() =>{
		try{
			await axiosInstance.post("/auth/logout");
			set({authUser:null});
			toast.success("Logged out successfully!");
			get().disconnectSocket();
		} catch (error){
			toast.error(error.response.data.message);
		}
	},
	
	login: async(data) =>{
		set({isLoggingIn:true});
		try{
			const res = await axiosInstance.post("/auth/login",data);
			set({authUser: res.data});
			toast.success("Logged in successfully!");
			
			get().connectSocket();
		} catch (error){
			toast.error(error.response.data.message);
		} finally{
			set({isLoggingIn: false});
		}
	},
	
	//As base64
	updateProfile: async(data) =>{
		set({isUpdatingProfile:true});
		try{
			const res = await axiosInstance.put("/auth/update-profile",data);
			set({authUser: res.data});
			
			toast.success("Profile picture updated successfully!");
		} catch (error){
			toast.error(error.response.data.message);
		} finally{
			set({isUpdatingProfile:false});
		}
	},
	
	connectSocket: () => {
		
		//Prevent non auth-ed users from consuming resources
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(BASE_URL, {
		query: {
				userId: authUser._id,
			},
		});
		socket.connect();

		set({ socket: socket });

		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});
	},
	
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	},
}));