"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WORK_HEX = "#5BAECC";
const PLAY_HEX = "#F0609E";

interface ModeContextType {
  isPlayMode: boolean;
  toggleMode: () => void;
  accentHex: string;
  rgba: (alpha: number) => string;
}

const ModeContext = createContext<ModeContextType>({
  isPlayMode: false,
  toggleMode: () => {},
  accentHex: WORK_HEX,
  rgba: (a) => `rgba(91, 174, 204, ${a})`,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [isPlayMode, setIsPlayMode] = useState(false);

  useEffect(() => {
    if (isPlayMode) {
      document.documentElement.setAttribute("data-play-mode", "true");
    } else {
      document.documentElement.removeAttribute("data-play-mode");
    }
  }, [isPlayMode]);

  const rgb = isPlayMode ? "240, 96, 158" : "91, 174, 204";

  return (
    <ModeContext.Provider
      value={{
        isPlayMode,
        toggleMode: () => setIsPlayMode((v) => !v),
        accentHex: isPlayMode ? PLAY_HEX : WORK_HEX,
        rgba: (a) => `rgba(${rgb}, ${a})`,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
