
"use client";

import { db } from "@/firebase";
import { Message } from "@/type";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { ImArrowUpRight2 } from "react-icons/im";
import { useAtomValue } from "jotai";
import { selectedPedomanAtom } from "@/lib/store/pedomanAtom"; // ✅ ganti di sini
import useSWR from "swr";
import ModelSelection from "./ModelSelection";

const ChatInput = ({ id }: { id?: string }) => {
  const chatId = id;
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { data: model } = useSWR("model", { fallbackData: "gpt-3.5-turbo" });

  const selectedPedoman = useAtomValue(selectedPedomanAtom); // ✅ ambil satu yang dipilih

  const userEmail = session?.user?.email || "unknown";
  const userName = session?.user?.name || "unknown";

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const combinedPrompt = selectedPedoman
      ? `${prompt}

      Role:
      Posisikan Anda sebagai Asisten Akademik yang ahli dalam penulisan skripsi mahasiswa FTI UNIBBA.

      Instruction:
      Sesuaikan teks berikut agar sesuai dengan format dan bahasa penulisan skripsi FTI UNIBBA.

      Pedoman:

      📌 ${selectedPedoman.title}
      ${selectedPedoman.pedoman}`

      : prompt;

    const message: Message = {
      text: prompt.trim(),
      createdAt: serverTimestamp(),
      user: {
        _id: userEmail,
        name: userName,
        avatar: session?.user?.image || "/image/usericon.png",
      },
      role: "user",
    };

    try {
      setLoading(true);
      let chatDocumentId = chatId;

      if (!chatId) {
        const docRef = await addDoc(collection(db, "users", userEmail, "chats"), {
          userId: userEmail,
          createdAt: serverTimestamp(),
        });
        chatDocumentId = docRef.id;
        router.push(`/chat/${chatDocumentId}`);
      }

      await addDoc(
        collection(db, "users", userEmail, "chats", chatDocumentId!, "messages"),
        message
      );

      setPrompt("");
      const notification = toast.loading("PorsiAI is thinking...");

      await fetch("/api/askchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: combinedPrompt,
          id: chatDocumentId,
          model,
          session: userEmail,
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (data?.success) {
          toast.success(data?.message, { id: notification });
        } else {
          toast.error(data?.message || "Gagal", { id: notification });
        }
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3">
      <form
        onSubmit={sendMessage}
        className="bg-white/10 rounded-full flex items-center px-4 py-2.5 w-full border border-black"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Message PorsiAI"
          className="bg-transparent text-primary-foreground font-medium placeholder:text-primary-foreground/50 px-3 outline-none w-full"
          disabled={loading}
        />
        <button
          disabled={!prompt || loading}
          type="submit"
          className="p-2.5 rounded-full bg-[#2483df] hover:bg-[#1f74c7] disabled:bg-gray-300 text-white"
        >
          <ImArrowUpRight2 className="-rotate-45 text-sm" />
        </button>
      </form>

      {id && (
        <p className="text-xs mt-2 font-medium tracking-wide">
          PorsiAI can make mistakes. Check important info.
        </p>
      )}
      <div className="w-full md:hidden mt-2">
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;
