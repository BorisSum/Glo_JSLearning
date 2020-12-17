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

      const btnMenu = document.querySelector('.menu');
      const menuBlock = document.querySelector('menu');
      const btnCloseMenu = document.querySelector('.close-btn');
      const menuItems = document.querySelectorAll('ul>li');

      const menuHandler = () => {
         menuBlock.classList.toggle('active-menu');
      };

      btnMenu.addEventListener('click', menuHandler);

      menuBlock.addEventListener('click', event => {
         let target = event.target;

         if (target === btnCloseMenu) {
            menuHandler();
         } else {
            menuItems.forEach(item => {
               target = target.closest('ul>li');
               if (target === item) {
                  menuHandler();
               }
            });
         }
      });

   };

   toggleMenu();

   // -------------------- PopUp ----------------------------------------------------------

   const togglePopup = () => {

      const popupMenu = document.querySelector('.popup');
      const popupButtons = document.querySelectorAll('.popup-btn');
      const btnPopupClose = document.querySelector('.popup-close');
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

   // -------------------- Табы --------------------------------------------------------
   const tabs = () => {
      const tabHeader = document.querySelector('.service-header');
      const tabs = tabHeader.querySelectorAll('.service-header-tab');
      const tabsContent = document.querySelectorAll('.service-tab');

      const toggleTabContent = index => {
         for (let i = 0; i < tabsContent.length; i++) {
            if (index === i) {
               tabs[i].classList.add('active');
               tabsContent[i].classList.remove('d-none');
            } else {
               tabs[i].classList.remove('active');
               tabsContent[i].classList.add('d-none');
            }
         }
      };

      tabHeader.addEventListener('click', event => {
         let target = event.target.closest('.service-header-tab');

         if (target) {
            tabs.forEach((item, index) => {
               if (item === target) {
                  toggleTabContent(index);
               }
            });
         }
      });
   };

   tabs();

   // --------------------- Слайдер -------------------------------------------

   const slider = () => {

      const slides = document.querySelectorAll('.portfolio-item');
      const slider = document.querySelector('.portfolio-content');
      const dotsList = document.querySelector('.portfolio-dots');


      // Добавляем точки в верстку

      slides.forEach(() => {
         dotsList.insertAdjacentHTML('beforeend', '<li class="dot"></li>');
      });

      const dots = document.querySelectorAll('.dot');
      dots[0].classList.add('dot-active');

      let currentSlide = 0;
      let slideInterval = null;

      const prevSlide = (elem, index, strClass) => {
         elem[index].classList.remove(strClass);
      };

      const nextSlide = (elem, index, strClass) => {
         elem[index].classList.add(strClass);
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

      const startSlide = (time = 3000) => {
         slideInterval = setInterval(autoPlaySlides, time);
      };

      const stopSlide = () => {
         clearInterval(slideInterval);
      };

      slider.addEventListener('click', event => {
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
               if (item === target) {
                  currentSlide = index;
               }
            });
         }

         if (currentSlide === slides.length) {
            currentSlide = 0;
         }

         if (currentSlide < 0) {
            currentSlide = slides.length - 1;
         }

         nextSlide(slides, currentSlide, 'portfolio-item-active');
         nextSlide(dots, currentSlide, 'dot-active');
      });

      slider.addEventListener('mouseover', event => {
         if (event.target.matches('.portfolio-btn') ||
            event.target.matches('.dot')) {
            stopSlide();
         }
      });

      slider.addEventListener('mouseout', event => {
         if (event.target.matches('.portfolio-btn') ||
            event.target.matches('.dot')) {
            startSlide(1500);
         }
      });

      startSlide(1500);

   };

   slider();

}); // закрывашка от DOMContentLoaded
