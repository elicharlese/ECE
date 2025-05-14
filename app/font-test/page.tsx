import { FontTest } from "@/components/font-test"

export default function FontTestPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Font Testing Page</h1>
        <FontTest />
      </div>
    </main>
  )
}
