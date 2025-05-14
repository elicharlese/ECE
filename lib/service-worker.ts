// This file is not directly used, but documents the service worker functionality
// next-pwa handles the actual service worker registration

export const registerServiceWorker = () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
    // Skip service worker registration in development
    if (process.env.NODE_ENV === "development") {
      return
    }

    const wb = window.workbox

    // Add offline fallbacks
    wb.routing.registerRoute(
      /\/api\/.*$/,
      new wb.strategies.NetworkFirst({
        cacheName: "api-cache",
        plugins: [
          new wb.expiration.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          }),
        ],
      }),
    )

    // Force update service worker on page load
    wb.addEventListener("installed", (event: any) => {
      if (event.isUpdate) {
        if (confirm("New app update is available. Reload to update?")) {
          window.location.reload()
        }
      }
    })

    // Offline status detection
    window.addEventListener("online", () => {
      console.log("App is online")
    })

    window.addEventListener("offline", () => {
      console.log("App is offline")
    })
  }
}
