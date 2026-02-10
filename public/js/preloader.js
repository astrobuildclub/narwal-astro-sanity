(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader__bar');
  const percent = preloader.querySelector('.preloader__percent');

  const minDisplay = Number(preloader.dataset.minDisplay || 500);
  const transitionDelay = Number(preloader.dataset.transitionDelay || 120);
  const transitionMax = Number(preloader.dataset.transitionMax || 2000);
  const completeHold = 140;
  const cleanupDelay = 220;

  const transitionKey = 'preloader-transition-pending';

  let current = 0;
  let target = 0;
  let rafId = null;
  let initialStart = 0;

  let allowTransitions = false;
  let transitionActive = false;
  let transitionDelayTimer = null;
  let transitionTimeout = null;
  let progressInterval = null;

  const prefersReducedMotion = () => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  };

  const update = () => {
    if (bar) {
      bar.style.width = `${current}%`;
    }
    if (percent) {
      percent.textContent = `${Math.round(current)}%`;
    }
  };

  const stop = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const tick = () => {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.1) current = target;
    update();

    if (current < target || current < 100) {
      rafId = requestAnimationFrame(tick);
    } else {
      stop();
    }
  };

  const start = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const resetProgress = () => {
    current = 0;
    target = 0;
    update();
  };

  const setTarget = (value) => {
    target = Math.max(target, value);
    start();
  };

  const setHidden = (hidden) => {
    preloader.classList.toggle('is-hidden', hidden);
  };

  const setBarOnly = (barOnly) => {
    preloader.classList.toggle('is-bar-only', barOnly);
  };

  const lockScroll = () => {
    document.documentElement.classList.add('preloader-lock-scroll');
    if (document.body) {
      document.body.classList.add('preloader-lock-scroll');
    }
  };

  const unlockScroll = () => {
    document.documentElement.classList.remove('preloader-lock-scroll');
    if (document.body) {
      document.body.classList.remove('preloader-lock-scroll');
    }
  };

  const clearTransitionTimers = () => {
    if (transitionDelayTimer) clearTimeout(transitionDelayTimer);
    if (transitionTimeout) clearTimeout(transitionTimeout);
    if (progressInterval) clearInterval(progressInterval);
    transitionDelayTimer = null;
    transitionTimeout = null;
    progressInterval = null;
  };

  const finalizeHiddenState = () => {
    setHidden(true);
    setBarOnly(true);
    if (document.body) {
      document.body.removeAttribute('data-navigating');
    }
    unlockScroll();
    setTimeout(() => {
      resetProgress();
      stop();
    }, cleanupDelay);
  };

  const trackImages = () => {
    const images = Array.from(document.images || []);
    if (images.length === 0) {
      setTarget(70);
      return;
    }

    const total = images.length;
    let loaded = 0;

    const updateProgress = () => {
      const ratio = loaded / total;
      setTarget(30 + ratio * 40);
    };

    images.forEach((img) => {
      if (img.complete) {
        loaded += 1;
        updateProgress();
        return;
      }

      const onDone = () => {
        loaded += 1;
        updateProgress();
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
      };

      img.addEventListener('load', onDone);
      img.addEventListener('error', onDone);
    });
  };

  const hideInitialOverlay = () => {
    setTarget(100);
    current = 100;
    update();

    const elapsed = performance.now() - initialStart;
    const remaining = Math.max(0, minDisplay - elapsed);

    setTimeout(() => {
      setTimeout(() => {
        document.documentElement.classList.remove('preloader-active');
        allowTransitions = true;
        finalizeHiddenState();
      }, completeHold);
    }, remaining);

    try {
      sessionStorage.setItem('preloader-shown', 'true');
    } catch (e) {}
  };

  const showInitialOverlay = () => {
    document.documentElement.classList.add('preloader-active');
    lockScroll();
    setBarOnly(false);
    setHidden(false);
    resetProgress();
    initialStart = performance.now();

    setTarget(5);

    const onDomReady = () => {
      setTarget(30);
      trackImages();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
    } else {
      onDomReady();
    }

    if (document.readyState === 'complete') {
      hideInitialOverlay();
    } else {
      window.addEventListener('load', hideInitialOverlay, { once: true });
    }
  };

  const hideTransitionBar = () => {
    clearTransitionTimers();

    if (!transitionActive) {
      setHidden(true);
      if (document.body) {
        document.body.removeAttribute('data-navigating');
      }
      unlockScroll();
      return;
    }

    current = Math.max(current, 95);
    setTarget(100);

    const waitForDone = () => {
      if (current >= 99.5) {
        stop();
        transitionActive = false;
        setTimeout(() => {
          finalizeHiddenState();
        }, completeHold);
        return;
      }
      requestAnimationFrame(waitForDone);
    };

    requestAnimationFrame(waitForDone);
  };

  const startTransitionBar = (options = {}) => {
    if (!allowTransitions || transitionActive || prefersReducedMotion()) return;

    const waitForLoad = options.waitForLoad === true;
    const maxDuration = waitForLoad
      ? Math.max(transitionMax, 10000)
      : transitionMax;

    transitionActive = true;
    resetProgress();
    setBarOnly(true);
    setHidden(false);
    start();

    const startedAt = performance.now();

    progressInterval = setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(95, (elapsed / maxDuration) * 95);
      setTarget(progress);
    }, 40);

    transitionTimeout = setTimeout(() => {
      hideTransitionBar();
    }, maxDuration);
  };

  const showTransitionBar = (options = {}) => {
    if (!allowTransitions || transitionActive || prefersReducedMotion()) return;
    if (!document.body) return;

    document.body.setAttribute('data-navigating', '');
    lockScroll();
    clearTransitionTimers();

    if (transitionDelay > 0) {
      transitionDelayTimer = setTimeout(() => {
        transitionDelayTimer = null;
        startTransitionBar(options);
      }, transitionDelay);
      return;
    }

    startTransitionBar(options);
  };

  const shouldShowInitial = (() => {
    if (prefersReducedMotion()) return false;

    try {
      if (sessionStorage.getItem('preloader-shown') === 'true') return false;
    } catch (e) {}

    const navEntry =
      typeof performance !== 'undefined' &&
      performance.getEntriesByType &&
      performance.getEntriesByType('navigation')[0];
    const navType = navEntry?.type;
    const legacyNavType =
      typeof performance !== 'undefined' &&
      performance.navigation &&
      performance.navigation.type;

    if (navType && navType !== 'navigate') return false;
    if (legacyNavType && legacyNavType !== 0) return false;

    return true;
  })();

  let pendingTransition = false;
  try {
    pendingTransition = sessionStorage.getItem(transitionKey) === 'true';
  } catch (e) {}

  if (shouldShowInitial) {
    showInitialOverlay();
  } else {
    document.documentElement.classList.remove('preloader-active');
    setHidden(true);
    setBarOnly(true);
    unlockScroll();
    resetProgress();
    allowTransitions = true;
  }

  document.addEventListener('astro:before-preparation', () => {
    if (!allowTransitions) return;
    try {
      sessionStorage.removeItem(transitionKey);
    } catch (e) {}
    showTransitionBar();
  });

  document.addEventListener('astro:before-swap', () => {
    if (!allowTransitions) return;
    if (!transitionActive && !transitionDelayTimer) {
      showTransitionBar();
    }
  });

  const onSwapDone = () => {
    if (!allowTransitions) return;
    hideTransitionBar();
  };

  document.addEventListener('astro:after-swap', onSwapDone);
  document.addEventListener('astro:page-load', onSwapDone);

  document.addEventListener('click', (event) => {
    if (!allowTransitions) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a');
    if (!link) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (e) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return;
    }

    try {
      sessionStorage.setItem(transitionKey, 'true');
    } catch (e) {}

    showTransitionBar();
  });

  if (!shouldShowInitial && pendingTransition) {
    try {
      sessionStorage.removeItem(transitionKey);
    } catch (e) {}

    showTransitionBar({ waitForLoad: true });

    if (document.readyState === 'complete') {
      hideTransitionBar();
    } else {
      window.addEventListener('load', hideTransitionBar, { once: true });
    }
  }

  window.addEventListener('beforeunload', () => {
    clearTransitionTimers();
    stop();
  });
})();
