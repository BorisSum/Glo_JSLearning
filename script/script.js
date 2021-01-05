window.addEventListener('DOMContentLoaded', () => {
   'use strict';

   const countTimer = deadLine => {
      const timerHours = document.querySelector('#timer-hours'),
         timerMinutes = document.querySelector('#timer-minutes'),
         timerSeconds = document.querySelector('#timer-seconds');

      let interval;

      const zeroFill = val => val < 10 ? '0' + val : val;


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

   countTimer('26 december 2020');


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

   const calc = (price = 100) => {

      const clacBlock = document.querySelector('.calc-block');
      const objectType = document.querySelector('.calc-type'); // Select
      const objectSquare = document.querySelector('.calc-square'); // Площадь
      const premisesCount = document.querySelector('.calc-count'); // кол-во помещений
      const daysCount = document.querySelector('.calc-day'); // кол-во дней
      const result = document.getElementById('total');

      const validateNumbers = target => target.value = target.value.replace(/[^\d]/g, '');

      const countSum = () => {
         let total = 0;
         let premisesCountVal = 1;
         let daysCountVal = 1;

         const objectTypeVal = objectType.options[objectType.selectedIndex].value;
         const objectSquareVal = +objectSquare.value;

         if (premisesCount.value > 1) {
            premisesCountVal += (premisesCount.value - 1) / 10;
         }

         if (daysCount.value && daysCount.value < 5) {
            daysCountVal *= 2;
         } else if (daysCount.value && daysCount.value < 10) {
            daysCountVal *= 1.5;
         }

         if (objectTypeVal && objectSquareVal) {
            total = price * objectTypeVal * objectSquareVal * premisesCountVal * daysCountVal;
         } else {
            total = 0;
            result.textContent = total;
            return;
         }

         // Выводим результат

         let tempResult = 0;

         tempResult = total - 1000;
         if (tempResult < 0) {
            tempResult = 0;
         }

         const interval = setInterval(() => {
            if (tempResult < total) {
               result.textContent = tempResult += 25;
            } else {
               result.textContent = Math.round(total);
               clearInterval(interval);
            }
         }, 5);
      };

      clacBlock.addEventListener('input', event => {
         let target = event.target;
         if (target.matches('input')) {
            validateNumbers(target);
         }
      });

      clacBlock.addEventListener('change', event => {
         let target = event.target;
         if (target.matches('input') || target.matches('select')) {
            countSum();
         }
      });
   };

   calc(100);


   // ---------------------------------- Подмена фоток ---------------------------------------------

   const changePhoto = () => {
      const photos = document.querySelectorAll('.command__photo');
      const photoContainer = document.querySelector('.command');

      const togglePicture = (target, selector) => {
         if (target.matches(selector)) {
            const currSrc = target.src;
            target.src = target.dataset.img;
            target.dataset.img = currSrc;
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

   // ------------------- Отправка форм --------------------------------------------------------

   const validatePhone = function () { this.value = this.value.replace(/[^\+\d]/g, ''); };
   const validateText = function () { this.value = this.value.replace(/[^а-я0-9 \.\,]/gi, ''); };
   const validateName = function () { this.value = this.value.replace(/[^а-я ]/gi, ''); };

   const errorMessage = 'Что-то пошло не так ...';
   const loadMessage = 'Загрузка ...';
   const successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

   // --------------------------------------------------------------------------
   const postData = (dataValues, outputData, errorData) => {
      const request = new XMLHttpRequest();
      request.addEventListener('readystatechange', () => {
         if (request.readyState !== 4) {
            return;
         }
         if (request.status === 200) {
            outputData();
         } else {
            errorData(request.status);
         }
      });

      request.open('POST', './server.php');
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify(dataValues));
   };


   // ------------------ Form1 Форма на первой странице ----------------------------------------------------
   const sendForm1 = () => {

      const form1 = document.getElementById('form1');
      const form1InputName = document.getElementById('form1-name');
      const form1InputEmail = document.getElementById('form1-email');
      const form1InputPhone = document.getElementById('form1-phone');
      const statusMessage = document.createElement('div');

      form1InputName.addEventListener('input', validateName);
      form1InputPhone.addEventListener('input', validatePhone);


      form1.addEventListener('submit', event => {
         event.preventDefault();
         form1.append(statusMessage);
         statusMessage.textContent = loadMessage;

         let form1DataValues = {};
         const form1Data = new FormData(form1);

         form1Data.forEach((item, index) => {
            form1DataValues[index] = item;
         });

         postData(form1DataValues,
            () => {
               statusMessage.textContent = successMessage;
            },
            (error) => {
               statusMessage.textContent = errorMessage;
               console.error(error);
            }
         );

         // очистка инпутов
         form1InputName.value = '';
         form1InputEmail.value = '';
         form1InputPhone.value = '';

      });
   };
   sendForm1();

   // ------------------ Form2 Форма в конце сайта -------------------------------

   const sendForm2 = () => {
      const form2 = document.getElementById('form2');
      const form2InputName = document.getElementById('form2-name');
      const form2InputEmail = document.getElementById('form2-email');
      const form2InputPhone = document.getElementById('form2-phone');
      const form2InputMessage = document.getElementById('form2-message');

      form2InputName.addEventListener('input', validateName);
      form2InputPhone.addEventListener('input', validatePhone);
      form2InputMessage.addEventListener('input', validateText);

      const statusMessage = document.createElement('div');
      statusMessage.style.cssText = `margin-top:15px;`;

      form2.addEventListener('submit', event => {
         event.preventDefault();
         form2.append(statusMessage);
         statusMessage.textContent = loadMessage;

         let form2DataValues = {};
         const form2Data = new FormData(form2);

         form2Data.forEach((item, index) => {
            form2DataValues[index] = item;
         });

         postData(form2DataValues,
            () => {
               statusMessage.textContent = successMessage;
            }, (error) => {
               statusMessage.textContent = errorMessage;
               console.error(error);
            }
         );

         // очистка инпутов
         form2InputName.value = '';
         form2InputEmail.value = '';
         form2InputPhone.value = '';
         form2InputMessage.value = '';

      });
   };

   sendForm2();

   // ------------------ Form3 Форма из popup меню -------------------------------

   const sendForm3 = () => {
      const form3 = document.getElementById('form3');
      const popupMenu = document.querySelector('.popup');
      const form3InputName = document.getElementById('form3-name');
      const form3InputEmail = document.getElementById('form3-email');
      const form3InputPhone = document.getElementById('form3-phone');

      form3InputName.addEventListener('input', validateName);
      form3InputPhone.addEventListener('input', validatePhone);

      form3.addEventListener('submit', event => {
         event.preventDefault();

         let form3DataValues = {};
         const form3Data = new FormData(form3);

         form3Data.forEach((item, index) => {
            form3DataValues[index] = item;
         });

         postData(form3DataValues,
            () => {
               alert(successMessage);
            },
            (error) => {
               alert(errorMessage);
               console.error(error);
            }
         );
         // очистка инпутов
         form3InputName.value = '';
         form3InputEmail.value = '';
         form3InputPhone.value = '';
         // Закрыть модальное оконо
         popupMenu.style.display = 'none';
      });
   };

   sendForm3();

}); // Закрывашка DOMContentLoaded
