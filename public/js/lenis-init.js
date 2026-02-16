(function () {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;
  if (!window.Lenis) return;

  let lenis;
  let rafId = null;
  let useGsapTicker = false;

  const createLenis = () => {
    if (lenis) return lenis;

    lenis = new window.Lenis({
      autoRaf: false,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
      duration: 1.05,
      anchors: true,
    });

    window.__lenis = lenis;
    return lenis;
  };

  const raf = (time) => {
    if (!lenis) return;
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  const startRaf = () => {
    if (useGsapTicker || rafId) return;
    rafId = requestAnimationFrame(raf);
  };

  const stopRaf = () => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  const setupGsapBridge = () => {
    if (!window.gsap || !window.ScrollTrigger || !lenis) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    useGsapTicker = true;
    stopRaf();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  };

  const instance = createLenis();
  if (!instance) return;

  setupGsapBridge();
  startRaf();

  document.addEventListener('astro:before-preparation', () => {
    if (!lenis) return;
    lenis.stop();
  });

  const resume = () => {
    if (!lenis) return;
    lenis.start();
  };

  document.addEventListener('astro:after-swap', resume);
  document.addEventListener('astro:page-load', resume);

  window.addEventListener('beforeunload', () => {
    stopRaf();
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    window.__lenis = null;
  });
})();
