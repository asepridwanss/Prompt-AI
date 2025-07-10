"use client";

import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github.css"; // atau gunakan tema lain

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
            } px-4 py-3 rounded-lg shadow-sm text-base tracking-wide whitespace-pre-wrap space-y-2 text-justify prose prose-sm max-w-none
              prose-headings:font-semibold
              prose-code:bg-gray-100 prose-code:text-pink-600 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded-lg prose-pre:p-4 overflow-x-auto
              prose-a:text-blue-600 hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-blockquote:italic
            `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message?.text || ""}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
