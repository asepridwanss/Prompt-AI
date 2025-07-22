"use client";
import { db } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { BsArrowDownCircle } from "react-icons/bs";
import { useEffect, useRef } from "react";

const Chat = ({ id }: { id: string }) => {
  const { data: session } = useSession();

  const userEmail = session?.user
    ? (session?.user?.email as string)
    : "unknown";
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages] = useCollection(
    query(
      collection(db, "chatsRequests", userEmail, "chats", id, "messages"),
      orderBy("createdAt", "asc")
    )
  );

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-w-6xl mx-auto">

      {messages?.empty && (
        <div className="flex flex-col items-center gap-2 py-5">
          <p>Type a prompt in below to get started!</p>
          <BsArrowDownCircle className="text-xl text-green-300 animate-bounce" />
        </div>
      )}
      {(() => {
        if (!messages || messages.empty) return null;
        
        const docs = messages.docs
          .map((doc) => ({
            id: doc.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(doc.data() as any),
          }))
          .sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;

            if (timeA === timeB) {
              // Jika waktu sama, tampilkan user dulu
              if (a.role === "user" && b.role === "assistant") return -1;
              if (a.role === "assistant" && b.role === "user") return 1;
              return 0;
            }

            return timeA - timeB;
          });

        return docs.map((message, index) => (
          <div key={message.id || index}>
            <Message message={message} />
          </div>
        ));
      })()}

      <div ref={bottomRef} />
    </div>
  );
};

export default Chat;
