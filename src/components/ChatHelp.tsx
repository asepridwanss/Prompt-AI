"use client";

import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { selectedPedomanAtom } from "@/lib/store/pedomanAtom";
import { getPedomanApiRequest } from "@/lib/getApiRequest";
import { MdEditNote } from "react-icons/md";

// Data tombol yang ditampilkan
const selectData = [
  { title: "Abstrak", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Latar Belakang", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Rumusan Masalah", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Batasan Masalah", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Tujuan Penelitian", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Daftar Pustaka", icon: <MdEditNote />, iconColor: "#2483DF" },
];

// Tipe lokal hanya untuk data dari API
interface PedomanAPIItem {
  poinBab: string;
  contoh: string | string[];
  konteks: string;
}

const ChatHelp = () => {
  const setSelectedPedoman = useSetAtom(selectedPedomanAtom);
  const [pedomanMap, setPedomanMap] = useState<
    Record<
      string,
      {
        title: string;
        role: string;
        instruction: string;
        examples: string[];
        context: string;
      }
    >
  >({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedoman = async () => {
      const data: PedomanAPIItem[] = await getPedomanApiRequest();
      const mapped: typeof pedomanMap = {};

      data.forEach((d) => {
        if (d.poinBab) {
          const key = d.poinBab.toLowerCase().trim();
          mapped[key] = {
            title: d.poinBab,
            role:
              "Posisikan Anda sebagai Asisten Akademik yang ahli dalam penulisan skripsi mahasiswa FTI UNIBBA.",
            instruction:
              "Sesuaikan teks  agar sesuai dengan format dan bahasa penulisan skripsi FTI UNIBBA. Pastikan jumlah huruf input yang diminta dikoreksi pengguna sama dengan output yang dihasilkan dari pentesuaian. Pastikan hasil koreksi berbahasa indonesia, jika ada istilah bahasa inggris miringkan hurufnya.",
            examples: Array.isArray(d.contoh) ? d.contoh : [d.contoh],
            context: d.konteks || "",
          };
        }
      });

      setPedomanMap(mapped);
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

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-3">
      {selectData.map((item, index) => {
        const isActive = item.title === activeTitle;
        return (
          <div
            key={index}
            onClick={() => handleClick(item.title)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-full cursor-pointer duration-300 ease-in-out group relative
              ${isActive
                ? "border-blue-500 bg-blue-100"
                : "border-primary-foreground/10 hover:bg-primary-foreground/10"
              }
            `}
          >
            <span style={{ color: item.iconColor }} className="text-xl">
              {item.icon}
            </span>
            <p className="text-sm font-medium tracking-wide">{item.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatHelp;
