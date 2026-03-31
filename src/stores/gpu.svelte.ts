/**
 * GPU quality detection and post-processing toggle.
 *
 * Auto-detects low-end devices and provides a reactive toggle
 * that can also be controlled via ?effects=off query param.
 */

type QualityTier = "low" | "high";

/**
 * MANUAL OVERRIDE: Set to "low" or "high" to force a specific mode for testing.
 * Set to null to re-enable auto-detection based on device hardware.
 */
const FORCE_QUALITY: QualityTier | null = null; 

function detectQuality(): QualityTier {
  // Check for manual override first
  if (FORCE_QUALITY) return FORCE_QUALITY;

  // Check for low-end signals
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

  if (!gl) return "low";

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const gpuRenderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
    : "";

  // Low-end mobile GPUs
  const isLowEndGPU =
    /mali-[gt][0-9]{2,3}|adreno\s?[23]\d{2}|powervr|sgx|apple gpu/i.test(
      gpuRenderer,
    );

  // Low core count (likely a weak device)
  const hasLowCores =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  // Low device memory (Chrome-only API)
  const hasLowMemory =
    "deviceMemory" in navigator &&
    (navigator as any).deviceMemory !== undefined &&
    (navigator as any).deviceMemory <= 4;

  // Mobile device
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  // Clean up the detection canvas
  canvas.remove();

  // Conservative: flag as low if mobile + any weak signal
  if (isMobile && (isLowEndGPU || hasLowCores || hasLowMemory)) {
    return "low";
  }

  // Also flag as low on any very weak GPU regardless of mobile
  if (isLowEndGPU) return "low";

  return "high";
}

// Check query param override: ?effects=off or ?effects=on
function getQueryOverride(): boolean | null {
  const params = new URLSearchParams(window.location.search);
  const val = params.get("effects");
  const quality = params.get("quality");

  if (val === "off" || val === "false" || quality === "low") return false;
  if (val === "on" || val === "true" || quality === "high") return true;
  return null; // no override
}

class GPU {
  /** Detected quality tier */
  qualityTier: QualityTier = $state("high");

  /** Whether post-processing effects are enabled */
  postProcessingEnabled = $state(true);

  /** Multisampling level (0 on low, up to 4 on high) */
  multisampling = $derived(this.qualityTier === "low" ? 0 : 4);

  constructor() {
    this.qualityTier = detectQuality();

    // Default: disable post-processing on low-end
    this.postProcessingEnabled = this.qualityTier !== "low";

    // Query param takes priority — also forces quality tier
    const override = getQueryOverride();
    if (override !== null) {
      this.postProcessingEnabled = override;
      this.qualityTier = override ? "high" : "low";
    }
  }
}

export const gpu = new GPU();
