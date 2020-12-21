window.addEventListener('DOMContentLoaded', () => {
   'use strict';

   const countTimer = deadLine => {
      const timerHours = document.querySelector('#timer-hours'),
         timerMinutes = document.querySelector('#timer-minutes'),
         timerSeconds = document.querySelector('#timer-seconds');

      let interval;

      const zeroFill = val => {
         if (val < 10) {
            return '0' + val;
         } else {
            return val;
         }
      };

      const getTimeRemaining = () => {
         const dateStop = new Date(deadLine).getTime(),
            dateNow = new Date().getTime(),
            timeRemaining = (dateStop - dateNow) / 1000,
            seconds = Math.floor(timeRemaining % 60),
            minutes = Math.floor((timeRemaining / 60) % 60),
            hours = Math.floor(timeRemaining / 3600);

         return { timeRemaining, hours, minutes, seconds };
      };

      const updateClock = () => {
         const timer = getTimeRemaining();

         if (timer.timeRemaining <= 0) {
            clearInterval(interval);
            timerHours.textContent = '00';
            timerMinutes.textContent = '00';
            timerSeconds.textContent = '00';
         } else {
            timerHours.textContent = zeroFill(timer.hours);
            timerMinutes.textContent = zeroFill(timer.minutes);
            timerSeconds.textContent = zeroFill(timer.seconds);
         }
      };
      updateClock(); // Сделал так, чтобы не видно цифр из верстки после загрузки страницы
      interval = setInterval(updateClock, 1000);
   };

   countTimer('16 december 2020');


   // ----------------------------------------- Menu -------------------------------------

   const toggleMenu = () => {

      const menuBlock = document.querySelector('menu');

      const openMenu = () => {
         menuBlock.classList.add('active-menu');
      };

      const closeMenu = () => {
         menuBlock.classList.remove('active-menu');
      };

      document.addEventListener('click', event => {
         let target = event.target;
         if (target.closest('.menu')) {
            openMenu();
         } else {
            if (!target.closest('menu')) { // кликнули мимо меню
               closeMenu();
               return;
            }
            if (target.matches('.close-btn')) { // кликнули по крестику
               closeMenu();
               return;
            }
            if (target.matches('a')) { // кликнули по пункту меню
               event.preventDefault();
               closeMenu();
               const strTraget = target.href.split("#")[1];
               const destinationView = document.querySelector(`#${strTraget}`);
               destinationView.scrollIntoView({ block: "start", behavior: "smooth" });
            }
         }
      });
   };

   toggleMenu();

   // -------------------- PopUp ----------------------------------------------------------

   const togglePopup = () => {

      const popupMenu = document.querySelector('.popup');
      const popupButtons = document.querySelectorAll('.popup-btn');
      const popupContent = popupMenu.querySelector('.popup-content');

      let coordY = 0;
      let requestID;

      const showPopup = () => {
         requestID = requestAnimationFrame(showPopup);
         coordY++;
         if (coordY < 15) {
            popupContent.style.top = coordY * 8 + 'px';
         } else {
            cancelAnimationFrame(requestID);
            coordY = 0;
         }
      };

      popupButtons.forEach(item => item.addEventListener('click', () => {
         popupMenu.style.display = 'block';
         if (screen.width >= 768) {
            showPopup();
         }
      }));

      popupMenu.addEventListener('click', event => {
         let target = event.target;

         if (target.classList.contains('popup-close')) {
            popupMenu.style.display = 'none';
         } else {
            target = target.closest('.popup-content');
            if (!target) {
               popupMenu.style.display = 'none';
            }
         }
      });
   };

   togglePopup();

   // ----------------- Прокрутка по кнопке ------------------------------------------------

   const btnDown = document.querySelector('[href="#service-block"]');

   btnDown.addEventListener('click', event => {
      event.preventDefault();
      let currScrollPos = document.documentElement.scrollTop;
      const scrollToPos = 830;
      let scrollReqId;

      const scrollDoc = () => {
         scrollReqId = requestAnimationFrame(scrollDoc);
         currScrollPos += 20;

         if (document.documentElement.scrollTop <= scrollToPos) {
            document.documentElement.scrollTo(0, currScrollPos);
         } else {
            cancelAnimationFrame(scrollReqId);
         }
      };
      scrollDoc();
   });


   // ----------------------- Табы ---------------------------------------------------------

   const tabs = () => {
      const tabButtonsWrapper = document.querySelector('.service-header');
      const tabButtons = tabButtonsWrapper.querySelectorAll('.service-header-tab');
      const tabElems = document.querySelectorAll('.service-tab');

      const toggleTabContent = index => {
         for (let i = 0; i < tabElems.length; i++) {
            if (index === i) {
               tabElems[i].classList.remove('d-none');
               tabButtons[i].classList.add('active');
            } else {
               tabElems[i].classList.add('d-none');
               tabButtons[i].classList.remove('active');
            }
         }
      };

      tabButtonsWrapper.addEventListener('click', event => {
         let target = event.target.closest('.service-header-tab');

         if (target) {
            tabButtons.forEach((item, index) => {
               if (item === target) {
                  toggleTabContent(index);
               }
            });
         }
      });
   };

   tabs();

   // -------------------------------- Слайдер ----------------------------------------

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

   slider();

   // ------------------------------- Калькулятор ------------------------------------------------

   const calc = () => {
      const clacBlock = document.querySelector('.calc-block');
      const validateNumbers = target => target.value = target.value.replace(/[^\d]/g, '');

      clacBlock.addEventListener('input', event => {
         let target = event.target;

         if (target.matches('.calc-square') ||
            target.matches('.calc-count') ||
            target.matches('.calc-day')) {
            validateNumbers(target);
         }
      });

   };

   calc();


   // ---------------------------------- Подмена фоток ---------------------------------------------

   const changePhoto = () => {
      const photos = document.querySelectorAll('.command__photo');
      const photoContainer = document.querySelector('.command');

      const togglePicture = (target, selector) => {
         if (target.matches(selector)) {
            photos.forEach(item => {
               if (target === item) {
                  const currSrc = item.src;
                  item.src = item.dataset.img;
                  item.dataset.img = currSrc;
               }
            });
         }
      };

      photoContainer.addEventListener('mouseover', event => {
         let target = event.target;
         togglePicture(target, '.command__photo');
      });

      photoContainer.addEventListener('mouseout', event => {
         let target = event.target;
         togglePicture(target, '.command__photo');
      });
   };

   changePhoto();


}); // Закрывашка DOMContentLoaded
