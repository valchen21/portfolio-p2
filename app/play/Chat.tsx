"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Side = "in" | "out";
type Bubble = { id: string; side: Side; text: string };
type Option = { label: string; onPick: () => void };

const FIRST_DELAY_MS = 2300; // wait for arcade entrance + brief beat
const TYPING_MS = 1100;
const POST_PICK_MS = 380;

let _id = 0;
const nextId = () => `b${_id++}`;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type ChatProps = {
  onTriggerCoin?: () => void;
  hidden?: boolean;
};

export default function Chat({ onTriggerCoin, hidden = false }: ChatProps) {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [options, setOptions] = useState<Option[] | null>(null);
  const [typing, setTyping] = useState(false);
  const cancelRef = useRef(false);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = new Audio("/Playground/typing%20sound.mp3");
    t.preload = "auto";
    t.loop = true;
    t.volume = 0.55;
    typingAudioRef.current = t;

    const s = new Audio("/Playground/message%20send.mp3");
    s.preload = "auto";
    s.volume = 0.7;
    sendAudioRef.current = s;

    // Warm up: muted autoplay is universally allowed, and once an audio
    // element has been played at least once it stays unlocked for the session.
    const warmUp = (a: HTMLAudioElement) => {
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {
          a.muted = false;
        });
    };
    warmUp(t);
    warmUp(s);

    return () => {
      t.pause();
      t.currentTime = 0;
      s.pause();
    };
  }, []);

  const playTyping = () => {
    const a = typingAudioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const stopTyping = () => {
    const a = typingAudioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  };

  const playSend = () => {
    const a = sendAudioRef.current;
    if (!a) return;
    try {
      // Skip the silent intro of the file so the sound feels immediate
      a.currentTime = 0.45;
      a.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const addBubble = (text: string, side: Side) => {
    setBubbles((prev) => [...prev, { id: nextId(), side, text }]);
  };

  const showTypingThenBubble = async (
    text: string,
    side: Side,
    isCancelled: () => boolean = () => cancelRef.current
  ) => {
    setTyping(true);
    playTyping();
    await sleep(TYPING_MS);
    if (isCancelled()) {
      stopTyping();
      return;
    }
    setTyping(false);
    stopTyping();
    playSend();
    addBubble(text, side);
  };

  useEffect(() => {
    // Local cancelled flag — survives Strict Mode double-mount safely
    let cancelled = false;
    const isCancelled = () => cancelled;
    (async () => {
      await sleep(FIRST_DELAY_MS);
      if (isCancelled()) return;
      await showTypingThenBubble("are you ready to play?", "in", isCancelled);
      if (isCancelled()) return;
      setOptions([
        { label: "yea!", onPick: () => handleYes() },
        { label: "nah take me back home", onPick: () => handleNo() },
      ]);
    })();
    return () => {
      cancelled = true;
      stopTyping();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYes = async () => {
    setOptions(null);
    addBubble("yea!", "out");
    await sleep(POST_PICK_MS);
    if (cancelRef.current) return;
    await showTypingThenBubble("here's a coin on us <3", "in");
    if (cancelRef.current) return;
    await showTypingThenBubble("have fun!", "in");
    if (cancelRef.current) return;
    await sleep(400);
    if (cancelRef.current) return;
    onTriggerCoin?.();
  };

  const handleNo = async () => {
    setOptions(null);
    addBubble("nah take me back home", "out");
    await sleep(POST_PICK_MS);
    if (cancelRef.current) return;
    await showTypingThenBubble("awww ok see u later :p", "in");
    if (cancelRef.current) return;
    await sleep(2000);
    if (cancelRef.current) return;
    router.push("/");
  };

  return (
    <div
      className="absolute right-16 top-28 z-30 w-[calc(60vw-4rem)] max-w-[920px] max-h-[calc(100vh-8rem)] overflow-y-auto flex flex-col gap-2.5"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.5s ease",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      <AnimatePresence initial={false}>
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${b.side === "in" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`px-7 py-4 rounded-[28px] text-xl md:text-2xl leading-snug max-w-[540px] break-words ${
                b.side === "in"
                  ? "bg-[#3a3a3c] text-[#F5EFE8]"
                  : "bg-[#0a84ff] text-white"
              }`}
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              }}
            >
              {b.text}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div
            key="typing-bubble"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.22 }}
            className="flex justify-start"
          >
            <div className="bg-[#3a3a3c] px-7 py-5 rounded-[28px] flex items-center gap-2">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {options && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex flex-wrap gap-2 justify-end mt-2"
          >
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={opt.onPick}
                className="px-6 py-3 rounded-full text-lg md:text-xl border-[1.5px] border-[#0a84ff] text-[#0a84ff] hover:bg-[#0a84ff] hover:text-white transition-colors duration-200 focus:outline-none focus-visible:outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
