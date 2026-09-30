let lowPowerDevice;
let webGL2Support;

export function isLowPowerDevice() {
  if (lowPowerDevice !== undefined) return lowPowerDevice;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const hasFewCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  const hasLittleMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;

  lowPowerDevice = hasFewCores || hasLittleMemory || Boolean(connection?.saveData);
  return lowPowerDevice;
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsWebGL2() {
  if (webGL2Support !== undefined) return webGL2Support;
  if (typeof document === 'undefined' || typeof WebGL2RenderingContext === 'undefined') {
    webGL2Support = false;
    return webGL2Support;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2');
  webGL2Support = Boolean(context);
  context?.getExtension('WEBGL_lose_context')?.loseContext();
  return webGL2Support;
}
