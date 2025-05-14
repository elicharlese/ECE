import Cookies from "js-cookie"

// Demo mode cookie/localStorage key
const DEMO_MODE_KEY = "eceDemoMode"

export const enableDemoMode = () => {
  try {
    // Set both localStorage and cookie with consistent key
    localStorage.setItem(DEMO_MODE_KEY, "true")
    Cookies.set(DEMO_MODE_KEY, "true", { expires: 7, path: "/" })
    console.log("Demo mode enabled: Storage set successfully")
    return true
  } catch (error) {
    console.error("Failed to enable demo mode:", error)
    return false
  }
}

export const disableDemoMode = () => {
  try {
    // Clear both localStorage and cookie
    localStorage.removeItem(DEMO_MODE_KEY)
    Cookies.remove(DEMO_MODE_KEY, { path: "/" })
    console.log("Demo mode disabled: Storage cleared successfully")
    return false
  } catch (error) {
    console.error("Failed to disable demo mode:", error)
    return false
  }
}

export const isDemoModeEnabled = () => {
  if (typeof window === "undefined") return false

  const fromLocalStorage = localStorage.getItem(DEMO_MODE_KEY) === "true"
  const fromCookie = Cookies.get(DEMO_MODE_KEY) === "true"

  return fromLocalStorage || fromCookie
}

// Direct navigation function that doesn't rely on Next.js router
export const navigateTo = (path: string) => {
  if (typeof window !== "undefined") {
    window.location.href = path
  }
}
