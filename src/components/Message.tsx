"use client";

import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BiCopy } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { marked } from "marked";

interface Props {
  message: DocumentData;
}

const Message = ({ message }: Props) => {
  const isChatGPT = message.user.name === "AI";
  const [copied, setCopied] = useState(false);

  // Tampilkan seluruh teks tanpa dipotong
  const trimmedText = message.text;

  const handleCopy = async () => {
    const markdownText = message?.text || "";
    const htmlContent = marked.parse(markdownText);

    const styledHTML = `
      <div style="
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
        text-align: justify;
      ">
        ${htmlContent}
      </div>
    `;

    const blob = new Blob([styledHTML], { type: "text/html" });

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Gagal menyalin:", error);
    }
  };

  return (
    <div className="py-6 md:px-10 px-4">
      <div
        className={`flex items-start gap-3 md:gap-5 ${
          isChatGPT ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div className="border border-gray-300 w-9 h-9 rounded-full overflow-hidden">
          <Image
            src={message?.user?.avatar}
            alt="userImage"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Chat Bubble */}
        <div
          className={`flex flex-col ${
            isChatGPT
              ? "items-end w-full"
              : "items-start w-fit max-w-3xl"
          }`}
        >
          <div
            className={`relative ${
              isChatGPT
                ? "bg-[#F7F7F8] text-gray-900 border border-gray-200"
                : "bg-[#2F2F2F] text-white"
            } 
            px-4 py-3 rounded-xl shadow-sm text-sm leading-relaxed tracking-wide whitespace-pre-wrap break-words text-justify prose prose-sm
            ${
              isChatGPT
                ? "max-w-[calc(100%-3.5rem-1.25rem)]"
                : ""
            }`}
          >
            <ReactMarkdown>{trimmedText || ""}</ReactMarkdown>

            {/* Tombol Salin */}
            <button
              onClick={handleCopy}
              className="absolute -bottom-6 right-0 text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1"
              title="Salin teks"
            >
              {copied ? (
                <>
                  <AiOutlineCheck className="w-4 h-4" />
                  Disalin
                </>
              ) : (
                <>
                  <BiCopy className="w-4 h-4" />
                  Salin
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
