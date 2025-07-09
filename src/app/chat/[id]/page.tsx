
import React from "react";
import Chat from "@/src/components/Chat";
import ChatInput from "@/src/components/ChatInput";

const ChatPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Await the params to ensure we have the chat ID
  const { id } = await params;

  return (
    <div className="flex flex-col justify-center h-full p-5 overflow-hidden">
      <div className="flex-1 overflow-y-scroll pt-10 md:pt-5">
        <Chat id={id} />
      </div>
      <ChatInput id={id} />
    </div>
  );
};

export default ChatPage;
