const slider = () => {

   const slides = document.querySelectorAll('.portfolio-item');
   const sliderElem = document.querySelector('.portfolio-content');
   const dotsList = document.querySelector('.portfolio-dots');

   slides.forEach(() => {
      dotsList.insertAdjacentHTML('beforeend', '<li class="dot"></li>');
   });

   const dots = document.querySelectorAll('.dot');
   dots[0].classList.add('dot-active');

   let currentSlide = 0;
   let autoPlayInterval = null;

   const prevSlide = (elem, index, selector) => {
      elem[index].classList.remove(selector);
   };

   const nextSlide = (elem, index, selector) => {
      elem[index].classList.add(selector);
   };

   const autoPlaySlides = () => {

      prevSlide(slides, currentSlide, 'portfolio-item-active');
      prevSlide(dots, currentSlide, 'dot-active');
      currentSlide++;
      if (currentSlide === slides.length) {
         currentSlide = 0;
      }
      nextSlide(slides, currentSlide, 'portfolio-item-active');
      nextSlide(dots, currentSlide, 'dot-active');
   };

   const startSlide = (delay = 3000) => {
      autoPlayInterval = setInterval(autoPlaySlides, delay);
   };

   const stopSlide = () => {
      clearInterval(autoPlayInterval);
   };

   sliderElem.addEventListener('click', event => {
      event.preventDefault();
      let target = event.target;

      if (!target.matches('.portfolio-btn, .dot')) {
         return;
      }
      prevSlide(slides, currentSlide, 'portfolio-item-active');
      prevSlide(dots, currentSlide, 'dot-active');

      if (target.matches('#arrow-right')) {
         currentSlide++;
      } else if (target.matches('#arrow-left')) {
         currentSlide--;
      } else if (target.matches('.dot')) {
         dots.forEach((item, index) => {
            if (target === item) {
               currentSlide = index;
            }
         });
      }

      if (currentSlide === slides.length) {
         currentSlide = 0;
      } else if (currentSlide < 0) {
         currentSlide = slides.length - 1;
      }
      nextSlide(slides, currentSlide, 'portfolio-item-active');
      nextSlide(dots, currentSlide, 'dot-active');

   });

   sliderElem.addEventListener('mouseover', event => {
      if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')) {
         stopSlide();
      }
   });

   sliderElem.addEventListener('mouseout', event => {
      if (event.target.matches('.portfolio-btn') || event.target.matches('.dot')) {
         startSlide(1500);
      }
   });

   startSlide(1500);

};

export default slider;