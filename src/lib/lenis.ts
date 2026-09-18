import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

let lenis: Lenis | undefined;
let tickerCallback: ((time: number) => void) | undefined;
let unsubscribeScroll: (() => void) | undefined;

function isScrollLocked() {
  return document.documentElement.classList.contains('preloader-lock-scroll');
}

function destroyLenis() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = undefined;
  }

  unsubscribeScroll?.();
  unsubscribeScroll = undefined;

  if (!lenis) return;

  lenis.destroy();
  lenis = undefined;
  window.__lenis = undefined;
}

function initLenis() {
  destroyLenis();

  const instance = new Lenis({
    autoRaf: false,
    anchors: true,
    autoToggle: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });

  lenis = instance;
  window.__lenis = instance;

  unsubscribeScroll = instance.on('scroll', ScrollTrigger.update);

  tickerCallback = (time) => {
    instance.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);

  if (isScrollLocked()) {
    instance.stop();
  }

  requestAnimationFrame(() => {
    if (lenis !== instance) return;
    instance.resize();
    ScrollTrigger.refresh();
  });
}

function startLenis() {
  if (!lenis) {
    initLenis();
    return;
  }

  if (isScrollLocked()) return;

  lenis.start();
  lenis.resize();
  ScrollTrigger.refresh();
}

document.addEventListener('astro:before-preparation', destroyLenis);
document.addEventListener('astro:before-swap', destroyLenis);
document.addEventListener('astro:page-load', initLenis);
document.addEventListener('preloader:nav-complete', startLenis);
window.addEventListener('beforeunload', destroyLenis);

export function getLenis() {
  return lenis ?? window.__lenis;
}
