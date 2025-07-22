"use client";

import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { motion } from "framer-motion";

interface Props {
  id: string;
  index: number;
}

const ChatRow = ({ id }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);

  const [messages, loading] = useCollection(
    query(
      collection(
        db,
        "users",
        session?.user?.email as string,
        "chats",
        id,
        "messages"
      )
    )
  );

  const [chatsSnapshot] = useCollection(
    query(
      collection(db, "users", session?.user?.email as string, "chats"),
      orderBy("createdAt", "desc")
    )
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname, id]);

  const handleRemoveChat = async () => {
    await deleteDoc(
      doc(db, "users", session?.user?.email as string, "chats", id)
    );
    if (active) {
      const nextChat = chatsSnapshot?.docs?.find((chat) => chat.id !== id);
      if (nextChat) {
        router.push(`/chat/${nextChat.id}`);
      } else {
        router.push("/");
      }
    }
  };

  const chat =
    messages?.docs[messages?.docs?.length - 1]?.data().text &&
    messages?.docs[messages?.docs?.length - 1]?.data();

  const chatText = chat?.text || "New Chat";
  const shouldAnimate = active;

  return (
    <Link
      href={`/chat/${id}`}
      className={`flex items-start gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 transition-colors ${
        active ? "bg-gray-100 dark:bg-white/10" : "bg-transparent"
      }`}
    >
      {/* Chat Icon */}
      <IoChatboxOutline className="text-xl text-gray-600 dark:text-gray-300 mt-1" />

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        <p className="text-sm text-gray-800 dark:text-white leading-relaxed break-words line-clamp-2">
          {shouldAnimate ? (
            chat?.text ? (
              chat.text.split("").map((character: string, index: number) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: { opacity: 0, x: -100 },
                    animate: { opacity: 1, x: 0 },
                  }}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                  }}
                >
                  <span className="text-sm font-normal text-[#2483df]">
                    {character}
                  </span>
                </motion.span>
              ))
            ) : loading ? (
              "...."
            ) : (
              chatText
            )
          ) : loading ? (
            "...."
          ) : (
            chatText
          )}
        </p>
      </div>

      {/* Trash Icon */}
      <BiSolidTrashAlt
        onClick={(e) => {
          e.preventDefault(); // Prevent link navigation
          handleRemoveChat();
        }}
        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer mt-1"
      />
    </Link>
  );
};

export default ChatRow;
