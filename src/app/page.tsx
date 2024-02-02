import { Profile } from "@/components/profile";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="grid place-content-center h-screen w-full">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" />}>
        <Profile />
      </Suspense>
    </main>
  );
}
