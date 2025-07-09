// lib/store/pedomanAtom.ts
"use client";

import { atom } from "jotai";

// Hanya satu pedoman aktif yang dipilih
export interface PedomanItem {
  title: string;
  pedoman: string;
}

export const selectedPedomanAtom = atom<PedomanItem | null>(null);
