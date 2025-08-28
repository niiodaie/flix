import { Navbar } from "@/components/layout/Navbar";
import { LensFeed } from "@/components/lens/LensFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <LensFeed userId="demo-user" />
      </main>
    </div>
  );
}
