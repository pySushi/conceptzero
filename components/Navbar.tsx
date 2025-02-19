import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

const navItems = [
  'Companies',
  'Sectors',
  'Countries',
  'Databases',
  'Analysis',
  'News',
  'Tools',
  'Services',
  'Webinars',
  'Themes',
] as const

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center">
        <Image src="/logo.png" alt="GlobalData Logo" width={40} height={40} className="mr-4" />
        <span className="text-xl font-bold">GlobalData.</span>
      </div>
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <Link key={item} href="#" className="text-gray-600 hover:text-gray-900">
            {item}
          </Link>
        ))}
        <Link href="#" className="text-orange-500 hover:text-orange-600">
          AI Hub
        </Link>
        <div className="flex items-center ml-4">
          <Image src="/profile.png" alt="Profile" width={32} height={32} className="rounded-full mr-2" />
          <span className="text-gray-600">Profile name</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
