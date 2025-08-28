import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-gray-800 p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">
        FLIX
      </Link>
      <div className="space-x-4">
        <Link href="/explore" className="text-gray-300 hover:text-white">
          Explore
        </Link>
        <Link href="/lens" className="text-gray-300 hover:text-white">
          LENS
        </Link>
        <Link href="/upload" className="text-gray-300 hover:text-white">
          Upload
        </Link>
        <Link href="/profile/me" className="text-gray-300 hover:text-white">
          Profile
        </Link>
        <Link href="/settings" className="text-gray-300 hover:text-white">
          Settings
        </Link>
      </div>
    </nav>
  );
}


