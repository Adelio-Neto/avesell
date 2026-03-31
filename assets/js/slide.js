document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".portfolio-swiper", {
    loop: true,
    speed: 700,
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".portfolio-swiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".portfolio-swiper .swiper-button-next",
      prevEl: ".portfolio-swiper .swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
    },
  });
});
