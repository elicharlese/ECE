export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ECE Trading Cards - Test
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            This is a test page to verify styling works without providers.
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Test Status</h2>
            <p className="text-green-400">✅ Test page is working!</p>
            <p className="text-slate-400 mt-2">Tailwind CSS: Loading</p>
            <p className="text-slate-400">Components: Rendering</p>
          </div>
        </div>
      </div>
    </div>
  )
}
