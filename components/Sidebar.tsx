import { HomeIcon, BarChartIcon, TargetIcon, FileTextIcon, MessageSquareIcon, HelpCircleIcon } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen text-lg">
      <nav className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Competitive Intelligence</h2>
        <div className="space-y-1">
          <Link href="#" className="flex items-center text-blue-600 py-2 px-3 bg-blue-50 rounded-md" prefetch={false}>
            <HomeIcon className="h-5 w-5 mr-3" />
            Home
          </Link>
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Plan</h3>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Territory Planner
            </Link>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Market Updates
            </Link>
          </div>
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <TargetIcon className="h-5 w-5 mr-2" />
              Target
            </h3>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Company Screener
            </Link>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Account Prioritizer
            </Link>
          </div>
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2" />
              Create
            </h3>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Customer Insights
            </Link>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Sales Enablement
            </Link>
          </div>
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <MessageSquareIcon className="h-5 w-5 mr-2" />
              Engage
            </h3>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Sales Triggers
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-200 mt-4">
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Help Page
            </Link>
            <Link href="#" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md" prefetch={false}>
              Ask An Analyst
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  )
}