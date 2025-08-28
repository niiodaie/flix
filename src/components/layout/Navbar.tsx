import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
      <Link href="/" className="text-white text-2xl font-bold">
        FLIX
      </Link>
      <div className="space-x-4">
        <Link href="/explore" className="text-gray-300 hover:text-white transition-colors">
          Explore
        </Link>
        <Link href="/lens" className="text-gray-300 hover:text-white transition-colors">
          LENS
        </Link>
        <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
          Upload
        </Link>
        <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link href="/profile/me" className="text-gray-300 hover:text-white transition-colors">
          Profile
        </Link>
        <Link href="/settings" className="text-gray-300 hover:text-white transition-colors">
          Settings
        </Link>
      </div>
    </nav>
  );
}


