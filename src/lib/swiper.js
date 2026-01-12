// @ts-nocheck
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Autoplay, Navigation, Controller, EffectFade } from 'swiper/modules';

// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/effect-fade';

import { numberWithZero, getCount } from '../lib/utils';

document.addEventListener(
  'astro:page-load',
  function () {
    const carousels = document.querySelectorAll('.carousel-gallery');

    carousels.forEach(function (comp, index) {
      const elBackgroundCarousel = comp.querySelector('.carousel-background');
      const elForegroundCarousel = comp.querySelector('.carousel-foreground');
      const elNextButton = comp.querySelector('.swiper-button-next');
      const elPrevButton = comp.querySelector('.swiper-button-prev');
      const elCurrentIndicator = comp.querySelector('.swiper-number-current');
      const elTotalIndicator = comp.querySelector('.swiper-number-total');

      if (
        elBackgroundCarousel &&
        elForegroundCarousel &&
        elNextButton &&
        elPrevButton
      ) {
        // Background carousel - master met autoplay
        const backgroundSwiper = new Swiper(elBackgroundCarousel, {
          autoplay: {
            delay: 5000,
            disableOnInteraction: false, // Blijf autoplay doen na interactie
          },
          slidesPerView: 1,
          slidesPerGroup: 1,
          loop: true,
          speed: 400,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          allowTouchMove: true, // Touch events toestaan op background (master)
          navigation: {
            nextEl: elNextButton,
            prevEl: elPrevButton,
          },
          modules: [EffectFade, Navigation, Autoplay, Controller],
        });

        // Foreground carousel - volgt de background, GEEN autoplay
        const foregroundSwiper = new Swiper(elForegroundCarousel, {
          // GEEN autoplay - volgt background via controller
          navigation: false,
          slidesPerView: 1,
          slidesPerGroup: 1,
          speed: 600,
          loop: true,
          slideToClickedSlide: true,
          allowTouchMove: false, // Geen touch events - wordt doorgegeven aan background
          modules: [Navigation, Controller], // Geen Autoplay module
        });

        // Koppel carousels - background controleert foreground (master-slave)
        backgroundSwiper.controller.control = foregroundSwiper;
        
        // Laat foreground carousel touch events doorgeven aan background
        // Dit zorgt ervoor dat swipen op foreground de background triggert
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;
        let touchTarget = null;
        let hasMoved = false;

        elForegroundCarousel.addEventListener('touchstart', (e) => {
          // Check of we op een klikbaar element zitten (link)
          touchTarget = e.target.closest('a');
          if (touchTarget) {
            // Laat link clicks werken
            return;
          }
          
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isSwiping = false;
          hasMoved = false;
        }, { passive: true });

        elForegroundCarousel.addEventListener('touchmove', (e) => {
          if (touchTarget) return; // Laat links werken
          if (!touchStartX || !touchStartY) return;
          
          const touchEndX = e.touches[0].clientX;
          const touchEndY = e.touches[0].clientY;
          const diffX = touchStartX - touchEndX;
          const diffY = touchStartY - touchEndY;
          
          // Alleen horizontaal swipen, niet verticaal scrollen
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            if (!hasMoved) {
              hasMoved = true;
              isSwiping = true;
              // Trigger swipe op background carousel
              if (diffX > 0) {
                // Swipe naar links = volgende slide
                backgroundSwiper.slideNext();
              } else {
                // Swipe naar rechts = vorige slide
                backgroundSwiper.slidePrev();
              }
            }
          }
        }, { passive: true });

        elForegroundCarousel.addEventListener('touchend', (e) => {
          if (isSwiping && !touchTarget) {
            // Voorkom default link click gedrag tijdens swipe
            e.preventDefault();
          }
          touchStartX = 0;
          touchStartY = 0;
          isSwiping = false;
          hasMoved = false;
          touchTarget = null;
        }, { passive: false });

        // Set initial indicator - gebruik realIndex voor loop compatibility
        const updateIndicators = () => {
          const realIndex =
            backgroundSwiper.realIndex !== undefined
              ? backgroundSwiper.realIndex
              : backgroundSwiper.activeIndex;
          // Voor loop mode: aantal echte slides (zonder duplicates)
          const slideCount = backgroundSwiper.params.loop
            ? backgroundSwiper.slides.length -
              (backgroundSwiper.loopedSlides || 0) * 2
            : backgroundSwiper.slides.length;

          let numCurrentSlide = realIndex + 1;
          let currentSlide = numberWithZero(numCurrentSlide);

          let numTotalSlides =
            slideCount > 0 ? slideCount : backgroundSwiper.slides.length;
          let totalSlides = numberWithZero(numTotalSlides);

          if (elCurrentIndicator) elCurrentIndicator.textContent = currentSlide;
          if (elTotalIndicator) elTotalIndicator.textContent = totalSlides;
        };

        // Initial update
        setTimeout(() => {
          updateIndicators();
        }, 100);

        // Update bij slide change - gebruik realIndex
        backgroundSwiper.on('slideChange', function (e) {
          updateIndicators();
        });
      }
    });
  },
  { once: false },
);
