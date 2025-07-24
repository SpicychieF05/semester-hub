'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Semester Hub
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/browse" className="text-gray-600 hover:text-gray-800">
                Browse Notes
              </Link>
            </li>
            <li>
              <Link href="/share" className="text-gray-600 hover:text-gray-800">
                Share Notes
              </Link>
            </li>
            <li>
              <Link href="/request" className="text-gray-600 hover:text-gray-800">
                Request Notes
              </Link>
            </li>
            <li>
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;