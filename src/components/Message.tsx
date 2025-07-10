"use client";

import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  message: DocumentData;
}

const Message = ({ message }: Props) => {
  const isChatGPT = message.user.name === "AI";

  return (
    <div className="py-5">
      <div
        className={`flex md:px-10 space-x-2.5 md:space-x-5 ${
          isChatGPT ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div className="border border-gray-900 bg-gray-600 w-9 h-9 rounded-full p-1 overflow-hidden">
          <Image
            src={message?.user?.avatar}
            alt="userImage"
            width={100}
            height={100}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Chat Bubble */}
        <div
          className={`flex flex-col max-w-md ${
            isChatGPT ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`${
              isChatGPT
                ? "bg-[#F7F7F8] text-gray-900 border border-gray-200"
                : "bg-[#2F2F2F] text-white"
            } px-4 py-2 rounded-lg shadow-sm text-base font-medium tracking-wide whitespace-pre-wrap space-y-2 text-justify prose prose-sm max-w-none`}
          >
            <ReactMarkdown>{message?.text || ""}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
