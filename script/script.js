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

      const menuHandler = () => {
         menuBlock.classList.toggle('active-menu');
      };

      btnMenu.addEventListener('click', menuHandler);

      menuBlock.addEventListener('click', event => {
         let target = event.target;

         if (target.classList.contains('close-btn')) {
            menuHandler();
         } else {
            target = target.closest('ul>li');
            if (!target) {
               return;
            }
            if (target) {
               event.preventDefault();
               menuHandler();
               const strTraget = target.querySelector('a').href.split("#")[1];
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

}); // Закрывашка DOMContentLoaded
