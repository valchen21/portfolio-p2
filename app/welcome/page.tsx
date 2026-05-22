"use client";

import { useRouter } from "next/navigation";
import EntranceIntro from "@/components/EntranceIntro";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <EntranceIntro
      onLeaving={() => {}}
      onComplete={() => router.push("/")}
    />
  );
}
