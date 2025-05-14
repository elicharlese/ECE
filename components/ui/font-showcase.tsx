import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FontShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-cursive text-2xl">Cursive Font Style</CardTitle>
          <CardDescription>Using Permanent Marker font family</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-cursive text-xl">This text is styled with the cursive font.</p>
          <p className="font-cursive text-lg mt-2">The quick brown fox jumps over the lazy dog. 1234567890</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 border rounded-md">
              <p className="font-cursive font-normal">Normal (400)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-cursive font-medium">Medium (500)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-cursive font-semibold">Semibold (600)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-cursive font-bold">Bold (700)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-thin text-2xl">Thin Font Style</CardTitle>
          <CardDescription>Using Raleway font family with light weights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-thin text-xl">This text is styled with the thin font.</p>
          <p className="font-thin text-lg mt-2">The quick brown fox jumps over the lazy dog. 1234567890</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 border rounded-md">
              <p className="font-thin font-thin">Thin (100)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin font-extralight">Extra Light (200)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin font-light">Light (300)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin font-normal">Normal (400)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-elegant text-2xl tracking-wide">Elegant Font Style</CardTitle>
          <CardDescription>Using Dancing Script with custom letter spacing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-elegant text-xl">This text is styled with the elegant font.</p>
          <p className="font-elegant text-lg mt-2">The quick brown fox jumps over the lazy dog. 1234567890</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 border rounded-md">
              <p className="font-elegant tracking-normal">Normal spacing</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-elegant tracking-wide">Wide spacing</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-elegant tracking-wider">Wider spacing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
