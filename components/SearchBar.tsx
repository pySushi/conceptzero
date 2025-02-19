import { Search, Mic } from 'lucide-react'

export default function Component() {
  const exampleSearches = [
    "Market trends",
    "Industry analysis",
    "Economic forecasts",
    "Company profiles",
  ]

  return (

      <div className="w-full max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600">
            GlobalData CI Bot
          </h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Ask any questions"
            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <Mic className="w-5 h-5" />
          </button>
          <button className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {exampleSearches.map((search, index) => (
            <button
              key={index}
              className="px-4 py-2 text-sm text-gray-700 bg-white rounded-full border border-gray-300 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
  )
}