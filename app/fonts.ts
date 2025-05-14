import { Quicksand, Raleway, Permanent_Marker, Dancing_Script } from "next/font/google"

export const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
})

export const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
})

export const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-permanent-marker",
  preload: true,
})

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dancing-script",
  weight: ["400", "500", "600", "700"],
  preload: true,
})

// Export a fonts object for easier import
export const fonts = {
  sans: quicksand,
  heading: raleway,
  marker: permanentMarker,
  script: dancingScript,
}
