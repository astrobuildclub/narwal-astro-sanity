(function () {
  if (window.__preloaderControllerInitialized) return;
  window.__preloaderControllerInitialized = true;

  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const root = document.documentElement;

  const primaryFill = preloader.querySelector('.preloader__initial-fill--primary');
  const navBar = preloader.querySelector('.preloader__nav-bar');
  const percent = preloader.querySelector('.preloader__percent');

  const minDisplay = Number(preloader.dataset.minDisplay || 500);
  const navDelay = Number(preloader.dataset.navTransitionDelay || 120);
  const navMax = Number(preloader.dataset.navTransitionMax || 2200);
  const completeHold = 140;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let target = 0;
  let rafId = null;
  let initialStart = 0;

  let navActive = false;
  let navHasSwapped = false;
  let navDelayTimer = null;
  let navProgressTimer = null;
  let navTimeout = null;

  const stopTick = () => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  const startTick = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const setMode = (mode) => {
    preloader.classList.remove('mode-initial', 'mode-nav');
    preloader.classList.add(mode === 'nav' ? 'mode-nav' : 'mode-initial');
  };

  const setHidden = (hidden) => {
    preloader.classList.toggle('is-hidden', hidden);
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

  const updateInitialProgress = (value) => {
    const clamped = Math.max(0, Math.min(100, value));

    if (primaryFill) {
      primaryFill.style.width = `${clamped}%`;
    }

    if (percent) {
      percent.textContent = `${Math.round(clamped)}%`;
    }
  };

  const updateNavProgress = (value) => {
    if (!navBar) return;
    const clamped = Math.max(0, Math.min(100, value));
    navBar.style.width = `${clamped}%`;
  };

  const tick = () => {
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.2) {
      current = target;
    }

    if (preloader.classList.contains('mode-nav')) {
      updateNavProgress(current);
    } else {
      updateInitialProgress(current);
    }

    if (current < 99.95 || target < 99.95) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    stopTick();
  };

  const setTarget = (value) => {
    target = Math.max(target, Math.min(100, value));
    startTick();
  };

  const resetProgress = () => {
    current = 0;
    target = 0;
    updateInitialProgress(0);
    updateNavProgress(0);
  };

  const clearNavTimers = () => {
    if (navDelayTimer) clearTimeout(navDelayTimer);
    if (navProgressTimer) clearInterval(navProgressTimer);
    if (navTimeout) clearTimeout(navTimeout);
    navDelayTimer = null;
    navProgressTimer = null;
    navTimeout = null;
  };

  const shouldShowInitial = (() => {
    if (prefersReducedMotion) return false;

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

  const hideInitial = () => {
    setTarget(100);

    const waitUntilDone = () => {
      if (current >= 99.5) {
        const elapsed = performance.now() - initialStart;
        const waitTime = Math.max(0, minDisplay - elapsed);

        setTimeout(() => {
          document.documentElement.classList.remove('preloader-active');
          setHidden(true);
          unlockScroll();

          try {
            sessionStorage.setItem('preloader-shown', 'true');
          } catch (e) {}

          setTimeout(() => {
            setMode('initial');
            resetProgress();
            stopTick();
          }, completeHold);
        }, waitTime);
        return;
      }

      requestAnimationFrame(waitUntilDone);
    };

    requestAnimationFrame(waitUntilDone);
  };

  const trackImagesForInitial = () => {
    const images = Array.from(document.images || []);
    if (!images.length) {
      setTarget(80);
      return;
    }

    const total = images.length;
    let loaded = 0;

    const bump = () => {
      const ratio = loaded / total;
      setTarget(34 + ratio * 52);
    };

    images.forEach((img) => {
      if (img.complete) {
        loaded += 1;
        bump();
        return;
      }

      const done = () => {
        loaded += 1;
        bump();
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
      };

      img.addEventListener('load', done);
      img.addEventListener('error', done);
    });
  };

  const finalizeNav = () => {
    if (!navActive) return;

    clearNavTimers();
    setTarget(100);

    const waitUntilDone = () => {
      if (current >= 99.5) {
        navActive = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            root.classList.remove('nav-transition-active');
            setHidden(true);
            setTimeout(() => {
              setMode('initial');
              resetProgress();
              stopTick();
            }, 220);
          });
        });
        return;
      }

      requestAnimationFrame(waitUntilDone);
    };

    requestAnimationFrame(waitUntilDone);
  };

  const startNav = () => {
    if (prefersReducedMotion || !document.body) return;
    if (navActive) return;

    navActive = true;
    navHasSwapped = false;
    clearNavTimers();
    root.classList.add('nav-transition-active');
    setMode('nav');
    setHidden(false);
    resetProgress();

    const startedAt = performance.now();

    const begin = () => {
      setTarget(10);

      navProgressTimer = setInterval(() => {
        const elapsed = performance.now() - startedAt;
        const progress = Math.min(93, (elapsed / navMax) * 93);
        setTarget(progress);
      }, 50);

      navTimeout = setTimeout(() => {
        finalizeNav();
      }, navMax + 250);
    };

    if (navDelay > 0) {
      navDelayTimer = setTimeout(begin, navDelay);
      return;
    }

    begin();
  };

  const onNavSwapDone = () => {
    if (!navActive) return;
    navHasSwapped = true;
    setTarget(97);
  };

  const onNavPageLoad = () => {
    if (!navHasSwapped) return;
    finalizeNav();
  };

  if (!shouldShowInitial) {
    document.documentElement.classList.remove('preloader-active');
    setHidden(true);
    setMode('initial');
    root.classList.remove('nav-transition-active');
    unlockScroll();
    resetProgress();
  } else {
    setMode('initial');
    setHidden(false);
    resetProgress();
    lockScroll();
    initialStart = performance.now();
    setTarget(10);

    const onDomReady = () => {
      setTarget(34);
      trackImagesForInitial();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
    } else {
      onDomReady();
    }

    if (document.readyState === 'complete') {
      hideInitial();
    } else {
      window.addEventListener('load', hideInitial, { once: true });
    }
  }

  document.addEventListener('astro:before-preparation', startNav);
  document.addEventListener('astro:before-swap', startNav);
  document.addEventListener('astro:after-swap', onNavSwapDone);
  document.addEventListener('astro:page-load', onNavPageLoad);

  window.addEventListener('beforeunload', () => {
    clearNavTimers();
    stopTick();
    root.classList.remove('nav-transition-active');
  });
})();
