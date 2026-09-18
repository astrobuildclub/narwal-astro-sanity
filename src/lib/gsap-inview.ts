type DeferRevealWindow = Window & {
  __deferReveal?: (fn: () => void) => void;
};

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isInInitialView(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.92 && rect.bottom > 0;
}

export function whenPageReady(fn: () => void) {
  const run = () => {
    const defer = (window as DeferRevealWindow).__deferReveal;
    if (typeof defer === 'function') {
      defer(fn);
      return;
    }
    fn();
  };

  if (document.documentElement.classList.contains('preloader-active')) {
    const onComplete = () => {
      document.removeEventListener('preloader:nav-complete', onComplete);
      run();
    };
    document.addEventListener('preloader:nav-complete', onComplete);
    return;
  }

  run();
}

export function createInViewController() {
  const observers: IntersectionObserver[] = [];

  function playWhenVisible(el: Element, play: () => void) {
    const run = () => {
      if (!document.contains(el)) return;
      play();
    };

    if (!('IntersectionObserver' in window) || isInInitialView(el)) {
      whenPageReady(run);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        run();
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    io.observe(el);
    observers.push(io);
  }

  function cleanup() {
    observers.forEach((observer) => observer.disconnect());
    observers.length = 0;
  }

  return { playWhenVisible, cleanup };
}
