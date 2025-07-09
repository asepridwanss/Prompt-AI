
"use client";

import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { selectedPedomanAtom } from "@/lib/store/pedomanAtom";
import { getPedomanApiRequest } from "@/lib/getApiRequest";
import { MdEditNote } from "react-icons/md";

const selectData = [
  { title: "Penulisan Abstrak", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Latar Belakang", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Rumusan Masalah", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Batasan Masalah", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Tujuan Penelitian", icon: <MdEditNote />, iconColor: "#2483DF" },
  { title: "Daftar Pustaka", icon: <MdEditNote />, iconColor: "#2483DF" },
];

const ChatHelp = () => {
  const setSelectedPedoman = useSetAtom(selectedPedomanAtom);
  const [pedomanMap, setPedomanMap] = useState<Record<string, string>>({});
  const [activeTitle, setActiveTitle] = useState<string | null>(null); // ✅ simpan item yang aktif

  useEffect(() => {
    const fetchPedoman = async () => {
      const data = await getPedomanApiRequest();
      const mapped: Record<string, string> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((d: any) => {
        if (d.poinBab) {
          const key = d.poinBab.toLowerCase().trim();
          mapped[key] = `${d.contoh || ""}\n\n${d.konteks || ""}`;
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
      // ✅ jika klik ulang, nonaktifkan
      setActiveTitle(null);
      setSelectedPedoman(null);
    } else {
      // ✅ jika klik berbeda, aktifkan yang baru
      setActiveTitle(title);
      if (pedoman) {
        setSelectedPedoman({ title, pedoman });
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
