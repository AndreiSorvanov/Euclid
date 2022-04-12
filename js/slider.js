const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  loop: true,

  autoplay: {
    delay: 5000,
  },

  // пагинация
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});
