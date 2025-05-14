import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FontShowcaseCurvedThin() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-curved text-2xl">Curved Font Style (Quicksand)</CardTitle>
          <CardDescription className="thin-text">Our primary font for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-curved text-xl">This text is styled with the curved font.</p>
          <p className="font-curved text-lg mt-2">The quick brown fox jumps over the lazy dog. 1234567890</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 border rounded-md">
              <p className="font-curved font-light">Light (300)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-curved font-normal">Normal (400)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-curved font-medium">Medium (500)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-curved font-bold">Bold (700)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-thin text-2xl">Thin Font Style (Raleway)</CardTitle>
          <CardDescription className="font-curved">Our complementary font for accents and special text</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-thin text-xl">This text is styled with the thin font.</p>
          <p className="font-thin text-lg mt-2">The quick brown fox jumps over the lazy dog. 1234567890</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 border rounded-md">
              <p className="font-thin-ultralight">Ultra Light (100)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin-light">Extra Light (200)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin">Light (300)</p>
            </div>
            <div className="p-4 border rounded-md">
              <p className="font-thin font-normal">Normal (400)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="heading-combo text-2xl">
            Combined Font Styles <span className="thin-accent">(Curved + Thin)</span>
          </CardTitle>
          <CardDescription>Using both fonts together for visual interest</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl mb-4">
            <span className="curved-thin-combo">
              <span className="curved">Curved </span>
              <span className="thin">meets </span>
              <span className="curved">Thin</span>
            </span>
          </h3>

          <p className="mb-4">
            <span className="font-curved">This paragraph starts with our curved font </span>
            <span className="font-thin">and transitions to our thin font for contrast.</span>
          </p>

          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h4 className="font-curved text-xl mb-2">Main Heading in Curved Font</h4>
            <p className="font-thin mb-4">Subheading or descriptive text in our thin font style.</p>
            <p className="font-curved">Back to our primary curved font for the main content.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
