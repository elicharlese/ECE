export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ECE Trading Cards
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Revolutionize corporate takeovers with strategic trading cards in the world's first M&A-focused digital platform.
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Server Status</h2>
            <p className="text-green-400">✅ Development server is running!</p>
            <p className="text-slate-400 mt-2">Port: 4200</p>
            <p className="text-slate-400">Database: Connected</p>
          </div>
        </div>
      </div>
    </div>
  )
}
