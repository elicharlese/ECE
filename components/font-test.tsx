export function FontTest() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="p-4 border rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Font Test</h2>
        <p className="font-sans text-lg mb-4">This text should be in Quicksand font (font-sans).</p>
        <p className="font-thin text-lg mb-4">This text should be in Raleway font (font-thin).</p>
        <p className="font-cursive text-lg mb-4">This text should be in Permanent Marker font (font-cursive).</p>
        <p className="font-elegant text-lg mb-4">This text should be in Dancing Script font (font-elegant).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-sans font-bold mb-2">Quicksand Weights</h3>
          <p className="font-sans font-light">Quicksand Light (300)</p>
          <p className="font-sans font-normal">Quicksand Regular (400)</p>
          <p className="font-sans font-medium">Quicksand Medium (500)</p>
          <p className="font-sans font-semibold">Quicksand Semibold (600)</p>
          <p className="font-sans font-bold">Quicksand Bold (700)</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-thin font-bold mb-2">Raleway Weights</h3>
          <p className="font-thin font-thin">Raleway Thin (100)</p>
          <p className="font-thin font-extralight">Raleway ExtraLight (200)</p>
          <p className="font-thin font-light">Raleway Light (300)</p>
          <p className="font-thin font-normal">Raleway Regular (400)</p>
          <p className="font-thin font-bold">Raleway Bold (700)</p>
        </div>
      </div>
    </div>
  )
}
