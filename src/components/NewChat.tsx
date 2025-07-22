"use client";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPlus } from "react-icons/fa";

const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
    const doc = await addDoc(
      collection(db, "chatsRequests", session?.user?.email as string, "chats"),
      {
        userId: session?.user?.email as string,
        createdAt: serverTimestamp(),
      }
    );
    router.push(`/chat/${doc?.id}`);
  };
  return (
  <button
  onClick={createNewChat}
  className="flex items-center justify-center gap-2 text-xs md:text-base border w-full rounded-md px-2 py-1 hover:bg-[#2076c9]/10 duration-300 ease-in-out text-[#2076c9] border-[#2076c9]"
>
  <FaPlus /> New Chat
</button>
  );
};

export default NewChat;
