"use client";

import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { selectedPedomanAtom } from "@/lib/store/pedomanAtom";
import { getPedomanApiRequest } from "@/lib/getApiRequest";
import { MdEditNote } from "react-icons/md";

// Tipe lokal hanya untuk data dari API
interface PedomanAPIItem {
  poinBab: string;
  contoh: string | string[];
  konteks: string;
}

const ChatHelp = () => {
  const setSelectedPedoman = useSetAtom(selectedPedomanAtom);
  const [pedomanList, setPedomanList] = useState<string[]>([]);
  const [pedomanMap, setPedomanMap] = useState<Record<string, {
    title: string;
    role: string;
    instruction: string;
    examples: string[];
    context: string;
  }>>({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false); // untuk toggle "More"

  useEffect(() => {
    const fetchPedoman = async () => {
      const data: PedomanAPIItem[] = await getPedomanApiRequest();
      const mapped: typeof pedomanMap = {};
      const titles: string[] = [];

      data.forEach((d) => {
        if (d.poinBab) {
          const key = d.poinBab.toLowerCase().trim();
          mapped[key] = {
            title: d.poinBab,
            role: "Posisikan Anda sebagai Asisten Akademik yang ahli dalam penulisan skripsi mahasiswa FTI UNIBBA.",
            instruction: "Sesuaikan teks agar sesuai dengan format dan bahasa penulisan skripsi FTI UNIBBA. Pastikan hasil koreksi berbahasa indonesia, jika ada istilah berbahasa inggris miringkan output hurufnya. Seuaikan format penulisannya seperti contoh yang diberikan.",
            examples: Array.isArray(d.contoh) ? d.contoh : [d.contoh],
            context: d.konteks || "",
          };
          titles.push(d.poinBab);
        }
      });

      setPedomanMap(mapped);
      setPedomanList(titles);
    };

    fetchPedoman();
  }, []);

  const handleClick = (title: string) => {
    const key = title.toLowerCase().trim();
    const pedoman = pedomanMap[key];

    if (activeTitle === title) {
      setActiveTitle(null);
      setSelectedPedoman(null);
    } else {
      setActiveTitle(title);
      if (pedoman) {
        setSelectedPedoman({
          title: pedoman.title,
          role: pedoman.role,
          instruction: pedoman.instruction,
          examples: pedoman.examples,
          context: pedoman.context,
        });
      }
    }
  };

  // Tentukan daftar yang akan ditampilkan (5 pertama jika belum klik "more")
  const displayedList = showAll ? pedomanList : pedomanList.slice(0, 5);

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
      {displayedList.map((title, index) => {
        const isActive = title === activeTitle;
        return (
          <div
            key={index}
            onClick={() => handleClick(title)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-full cursor-pointer duration-300 ease-in-out group
              ${isActive ? "border-blue-500 bg-blue-100" : "border-primary-foreground/10 hover:bg-primary-foreground/10"}
            `}
          >
            <span style={{ color: "#2483DF" }} className="text-xl">
              <MdEditNote />
            </span>
            <p className="text-sm font-medium tracking-wide">{title}</p>
          </div>
        );
      })}

      {/* Tombol "Lainnya"/"Tutup" jika item lebih dari 5 */}
      {pedomanList.length > 5 && (
        <div
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 border px-4 py-2 rounded-full cursor-pointer border-primary-foreground/10 hover:bg-primary-foreground/10 duration-300"
        >
          <span className="text-sm font-medium tracking-wide text-blue-500">
            {showAll ? "Tutup" : `+${pedomanList.length - 5} lainnya`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatHelp;
