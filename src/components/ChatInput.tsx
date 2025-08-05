"use client";

import { db } from "@/firebase";
import { Message } from "@/type";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImArrowUpRight2 } from "react-icons/im";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedPedomanAtom } from "@/lib/store/pedomanAtom";
import useSWR from "swr";
import ModelSelection from "./ModelSelection";
import ChatHelp from "./ChatHelp";

const ChatInput = ({ id }: { id?: string }) => {
  const chatId = id;
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { data: model } = useSWR("model", { fallbackData: "gpt-4o" });

  const selectedPedoman = useAtomValue(selectedPedomanAtom);
  const resetSelectedPedoman = useSetAtom(selectedPedomanAtom);

  const userEmail = session?.user?.email || "unknown";
  const userName = session?.user?.name || "unknown";

  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref untuk textarea

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (chatId) {
      resetSelectedPedoman(null);
    }
  }, [chatId, resetSelectedPedoman]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    if (!session) {
      toast.error("Silakan login terlebih dahulu.");
      router.push("/signin");
      return;
    }

    const combinedPrompt = selectedPedoman
      ? `Peran:
${selectedPedoman.role}

Instruksi:
${selectedPedoman.instruction}

Contoh format penulisan:
- ${selectedPedoman.examples[0] || "Tidak tersedia."}

Konteks:
${selectedPedoman.context}

Teks yang ingin disesuaikan:
${prompt}`
      : `#USE_PEDOMAN_TXT\n${prompt}`;

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
        const docRef = await addDoc(
          collection(db, "chatsRequests", userEmail, "chats"),
          {
            userId: userEmail,
            createdAt: serverTimestamp(),
          }
        );
        chatDocumentId = docRef.id;
        router.push(`/chat/${chatDocumentId}`);
      }

      await addDoc(
        collection(
          db,
          "chatsRequests",
          userEmail,
          "chats",
          chatDocumentId!,
          "messages"
        ),
        message
      );

      setPrompt("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset tinggi textarea
      }

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

  if (status === "loading") return null;

  return (
    <div className="w-full flex flex-col items-center justify-center pt-3 px-4 sm:px-6 md:px-8">
      <form
        onSubmit={sendMessage}
        className="bg-white/10 rounded-xl flex items-end gap-2 px-4 py-2 w-full max-w-3xl border border-black overflow-hidden min-w-0"
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          placeholder="Message PorsiAI"
          rows={1}
          className="flex-1 bg-transparent resize-none text-primary-foreground font-medium placeholder:text-primary-foreground/50 w-full px-3 py-2 outline-none h-auto max-h-52 overflow-y-auto"
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

      {/* ChatHelp di bawah textfield tanpa menggeser ke atas */}
      {id && (
        <div className="w-full mt-2 max-w-3xl overflow-hidden">
          <ChatHelp />
        </div>
      )}

      <div className="w-full md:hidden mt-2">
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;
