import React from 'react'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <Head>
        <title>Your Application Name</title>
        <meta name="description" content="Your application description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 max-w-7xl">
              {children}
            </main>
            <footer className="bg-white p-4 text-center">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}