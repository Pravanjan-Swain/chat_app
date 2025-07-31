import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = "http://localhost:5001";

// useAuthStore returns an object
export const useAuthStore = create((set, get) => ({ 
    authUser:null, // initially we don't know whether the user is authenticated or not
    isSigningUp : false, 
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth:true, 
    onlineUsers : [],
    socket : null,

    checkAuth: async() => {
        try{
            const response = await axiosInstance.get("/auth/check"); // When error is thrown(i.e. error with status 401 or 501) catch is executed.
            set({authUser:response.data});
            get().connectSocket();
        }
        catch(err){
            console.log("Error in checkAuth:", err);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup : async(data) => {
        set({isSigningUp : true});
        try{    
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser : res.data});
            toast.success("Account created successfully");
            get().connectSocket();    
        }
        catch(err){
            toast.error(err.response.data.message);
        }
        finally{
            set({isSigningUp : false});
        }
    },

    login : async(data) => {

        set({isLoggingIn : true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data});
            toast.success("Logged in successfully");
            get().connectSocket(); 
        }
        catch(err){
            toast.error(err.response.data.message);
        }
        finally{
            set({isLoggingIn : false});
        }
    },

    logout : async() => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    },

    updateProfile : async(data) => {
        set({isUpdatingProfile : true});
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser : res.data});
            toast.success("Profile updated successfully");
        }
        catch(err){
            console.log("error in update profile:",err);
            toast.error(err.response.data.message);
        }
        finally{
            set({isUpdatingProfile : false});
        }
    },

    connectSocket : () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return; //do not connect if already connected
        //socket.connected returns true if the socket is currently connected to the server.

        //This creates a Socket.IO client instance and prepares it to connect to the server at BASE_URL.
        //The second argument is an options object — in this case, you're passing a query.
        //This adds a query parameter to the WebSocket connection URL.
        //So the server will receive something like: ws://BASE_URL/socket.io/?userId=123456
        const socket = io(BASE_URL,{
            query : {
                userId : authUser._id,
            },
        })

        //This manually initiates the WebSocket connection to the server.
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers : userIds});
        })
    },
    disconnectSocket : () => {
        if(get().socket?.conneted) get().socket.disconnect();
    }
}));