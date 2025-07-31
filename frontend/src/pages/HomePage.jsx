import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

function HomePage() {
    const {selectedUser} = useChatStore();
    
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4 h-full">
                <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-full">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar className="h-full" />
                        {!selectedUser ? <NoChatSelected className="flex-1" /> : <ChatContainer className="flex-1" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;