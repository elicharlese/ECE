// Lightweight shim for three/examples/jsm/exporters/USDZExporter.js
// If your app needs real USDZ export, replace this shim with actual re-export from three
// or remove this shim once the bundler can resolve the real module.
export class USDZExporter {
  parse(/*scene, options*/) {
    if (process.env.NODE_ENV !== 'production') {
      // Non-fatal in dev to allow page to render without AR export support
      console.warn('[USDZExporter shim] USDZ export is not available in this environment.');
    }
    return new ArrayBuffer(0);
  }
}
