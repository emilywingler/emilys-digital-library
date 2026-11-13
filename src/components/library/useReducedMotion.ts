/** True when the visitor asked the OS for reduced motion. Read at interaction time (not render), so SSR is unaffected. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Resolves once an image is decoded, or after `timeout` ms — whichever comes first. */
export function preloadImage(src: string, timeout = 900): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve();
    const timer = setTimeout(done, timeout);
    const img = new Image();
    img.src = src;
    const finish = () => { clearTimeout(timer); done(); };
    if (typeof img.decode === "function") img.decode().then(finish, finish);
    else { img.onload = finish; img.onerror = finish; }
  });
}
