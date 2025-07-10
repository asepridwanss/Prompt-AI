"use client";

import { atom } from "jotai";

export interface PedomanItem {
  title: string;
  role: string;
  instruction: string;
  examples: string[];
  context: string;
}

export const selectedPedomanAtom = atom<PedomanItem | null>(null);
