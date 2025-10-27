import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSelectConversation = (id) => {
    setSelectedId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 gap-4">
      {/* <div
        className={`md:w-80 w-full md:flex-shrink-0 ${
          sidebarOpen ? "" : "md:block"
        }`}
      >
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelectConversation}
          onToggleMobile={() => setSidebarOpen((s) => !s)}
        />
      </div> */}

      <div className="flex-1 min-h-[60vh] bg-transparent">
        {/* <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} /> */}
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
