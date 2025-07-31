import { useEffect, useRef } from "react";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

function ChatContainer() {
    //When component uses any state from store then any changes in the state causes the component to re-render
    const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);

    //getMessages, subscribeToMessages, and unsubscribeFromMessages don’t change between renders, which is usually true for Zustand store functions because:
    //Zustand functions are stable references (not redefined on every render like inline functions or functions inside components).
    //Zustand keeps them the same unless explicitly changed.

    //According to React, every variable (including functions) used inside a useEffect should be listed as a dependency, even if it doesn't change.
    //Not listing them can lead to bugs if you later change how the store or those functions work (like hot-reloading, or defining store functions inline somewhere else).
    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        
        return () => unsubscribeFromMessages(); // return function is run before the useEffect re-runs.
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behaviour : "smooth"});
        }
    }, [messages]);

    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                    ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.jpg" : selectedUser.profilePic || "/avatar.jpg"} alt="Profile Pic" />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
    );
}

export default ChatContainer;