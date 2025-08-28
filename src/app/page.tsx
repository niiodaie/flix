import { Navbar } from "@/components/layout/Navbar";
import { LensFeed } from "@/components/lens/LensFeed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Navbar />
      <LensFeed />
    </main>
  );
}
