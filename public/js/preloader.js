(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader__bar');
  const percent = preloader.querySelector('.preloader__percent');
  const minDisplay = Number(preloader.dataset.minDisplay || 500);
  const transitionDelay = Number(preloader.dataset.transitionDelay || 120);
  const transitionMax = Number(preloader.dataset.transitionMax || 2000);
  const completeHold = 140;

  let current = 0;
  let target = 0;
  let rafId = null;
  let startTime = 0;
  let animating = false;
  let transitionTimer = null;
  let transitionTimeout = null;
  let transitionActive = false;
  let progressInterval = null;

  const update = () => {
    try {
      if (bar) {
        bar.style.width = `${current}%`;
        // Update accessibility attribute
        bar.setAttribute('aria-valuenow', Math.round(current).toString());
      }
      if (percent) percent.textContent = `${Math.round(current)}%`;
    } catch (error) {
      console.error('Preloader update error:', error);
    }
  };

  const start = () => {
    if (animating) return;
    animating = true;
    rafId = requestAnimationFrame(tick);
  };

  const stop = () => {
    animating = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  const tick = () => {
    if (!animating) return;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.1) current = target;
    update();

    if (current < target || current < 100) {
      rafId = requestAnimationFrame(tick);
    } else {
      stop();
    }
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

  const resetProgress = () => {
    current = 0;
    target = 0;
    update();
  };

  const showOverlay = () => {
    setBarOnly(false);
    setHidden(false);
    resetProgress();
    startTime = performance.now();
    setTarget(5);
  };

  const hideOverlay = () => {
    setTarget(100);
    current = 100;
    update();
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, minDisplay - elapsed);

    setTimeout(() => {
      setTimeout(() => {
        document.documentElement.classList.remove('preloader-active');
        allowTransitions = true;
        setHidden(true);
        setBarOnly(true);
        setTimeout(() => {
          resetProgress();
          stop();
        }, 220);
      }, completeHold);
    }, remaining);

    try {
      sessionStorage.setItem('preloader-shown', 'true');
    } catch (e) {}
  };

  const trackImages = () => {
    const images = Array.from(document.images || []);
    if (images.length === 0) {
      setTarget(70);
      return;
    }

    let loaded = 0;
    const total = images.length;

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

  const onDomReady = () => {
    setTarget(30);
    trackImages();
  };

  const transitionKey = 'preloader-transition-pending';
  const shouldShowInitial = (() => {
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
  let allowTransitions = !shouldShowInitial;
  let pendingTransition = false;
  try {
    pendingTransition = sessionStorage.getItem(transitionKey) === 'true';
  } catch (e) {}

  if (shouldShowInitial) {
    showOverlay();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
    } else {
      onDomReady();
    }

    if (document.readyState === 'complete') {
      hideOverlay();
    } else {
      window.addEventListener('load', hideOverlay, { once: true });
    }
  } else {
    document.documentElement.classList.remove('preloader-active');
    setHidden(true);
    setBarOnly(true);
    resetProgress();
    allowTransitions = true;
  }

  const showTransitionBar = (options = {}) => {
    if (transitionActive) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    try {
      const waitForLoad = options.waitForLoad === true;
      const maxDuration = waitForLoad
        ? Math.max(transitionMax, 10000)
        : transitionMax;

      transitionActive = true;
      resetProgress();
      setBarOnly(true);
      setHidden(false);
      if (bar) {
        bar.style.backgroundColor = '';
        bar.style.display = '';
      }
      update();
      start();

      const startTime = performance.now();

      progressInterval = setInterval(() => {
        try {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(100, (elapsed / maxDuration) * 100);
          setTarget(progress);
        } catch (error) {
          console.error('Preloader progress interval error:', error);
          clearInterval(progressInterval);
        }
      }, 40);

      transitionTimeout = setTimeout(() => {
        if (progressInterval) clearInterval(progressInterval);
        hideTransitionBar();
      }, maxDuration);
    } catch (error) {
      console.error('Preloader showTransitionBar error:', error);
      setHidden(true);
      setBarOnly(true);
      transitionActive = false;
    }
  };

  const hideTransitionBar = () => {
    if (!transitionActive) return;

    try {
      if (transitionTimeout) clearTimeout(transitionTimeout);
      transitionTimeout = null;
      if (progressInterval) clearInterval(progressInterval);
      progressInterval = null;

      current = Math.max(current, 95);
      setTarget(100);
      const checkComplete = () => {
        if (current >= 99.5) {
          stop();
          transitionActive = false;
          setTimeout(() => {
            setHidden(true);
            setTimeout(() => {
              resetProgress();
              stop();
            }, 220);
          }, completeHold);
          return;
        }
        requestAnimationFrame(checkComplete);
      };
      requestAnimationFrame(checkComplete);
    } catch (error) {
      console.error('Preloader hideTransitionBar error:', error);
      transitionActive = false;
      setHidden(true);
      setBarOnly(true);
      resetProgress();
      stop();
    }
  };

  document.addEventListener('astro:before-preparation', () => {
    try {
      if (!allowTransitions) return;
      document.body.setAttribute('data-navigating', '');
      if (transitionActive) return;
      sessionStorage.removeItem(transitionKey);
      showTransitionBar();
    } catch (error) {
      console.error('Preloader before-preparation error:', error);
    }
  });

  document.addEventListener('astro:before-swap', () => {
    try {
      if (!allowTransitions) return;
      if (!transitionActive) {
        try {
          sessionStorage.removeItem(transitionKey);
        } catch (e) {}
        showTransitionBar();
      }
    } catch (error) {
      console.error('Preloader before-swap error:', error);
    }
  });

  const onSwapDone = () => {
    try {
      if (!allowTransitions) return;
      if (transitionTimer) clearTimeout(transitionTimer);
      transitionTimer = null;
      hideTransitionBar();
    } catch (error) {
      console.error('Preloader swap done error:', error);
    }
  };

  document.addEventListener('astro:after-swap', onSwapDone);
  document.addEventListener('astro:page-load', onSwapDone);

  // Cleanup bij page unload
  window.addEventListener('beforeunload', () => {
    try {
      if (transitionTimer) clearTimeout(transitionTimer);
      if (transitionTimeout) clearTimeout(transitionTimeout);
      if (progressInterval) clearInterval(progressInterval);
      if (rafId) cancelAnimationFrame(rafId);
    } catch (error) {
      // Silent fail - page is unloading anyway
    }
  });

  document.addEventListener('click', (event) => {
    try {
      if (!allowTransitions) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

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
      document.body.setAttribute('data-navigating', '');
      showTransitionBar();
    } catch (error) {
      console.error('Preloader click handler error:', error);
    }
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
})();
