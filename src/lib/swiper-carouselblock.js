// @ts-nocheck
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";

// import Swiper and modules styles
import "swiper/css";
import "swiper/css/effect-fade";

import { numberWithZero } from "./utils";

document.addEventListener('astro:page-load', function() {
  const carousels = document.querySelectorAll(".carouselblock-gallery");

  carousels.forEach(function (comp) {
    const elBackgroundCarousel = comp.querySelector(".carousel-background");
    const elNextButton = comp.querySelector(".swiper-button-next");
    const elPrevButton = comp.querySelector(".swiper-button-prev");
    const elCurrentIndicator = comp.querySelector(".swiper-number-current");
    const elTotalIndicator = comp.querySelector(".swiper-number-total");

    if (elBackgroundCarousel && elNextButton && elPrevButton) {
      const backgroundSwiper = new Swiper(elBackgroundCarousel, {
        autoplay: {
          delay: 5000,
        },
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        speed: 400,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        allowTouchMove: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        modules: [EffectFade, Navigation, Autoplay],
      });

      // Set initial indicator
      if (elCurrentIndicator && elTotalIndicator) {
        let numCurrentSlide = backgroundSwiper.activeIndex + 1;
        let currentSlide = numberWithZero(numCurrentSlide);

        let numTotalSlides = backgroundSwiper.slides.length;
        let totalSlides = numberWithZero(numTotalSlides);

        // Update values
        elCurrentIndicator.textContent = currentSlide;
        elTotalIndicator.textContent = totalSlides;

        backgroundSwiper.on("slideChange", function (e) {
          currentSlide = numberWithZero(e.realIndex + 1);
          elCurrentIndicator.textContent = currentSlide;
        });
      }
    }
  });
}, { once: false });

