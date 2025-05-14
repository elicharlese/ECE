import { FontShowcaseCurvedThin } from "@/components/ui/font-showcase-curved-thin"

export default function FontShowcasePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-curved mb-6">Font Showcase</h1>
      <p className="font-thin text-lg mb-8">
        This page demonstrates our curved main font (Quicksand) and complementary thin subfont (Raleway).
      </p>
      <FontShowcaseCurvedThin />
    </div>
  )
}
