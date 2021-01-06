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

   countTimer('11 january 2021');


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

   function maskPhone(selector, masked = '+7 (___) ___-__-__') {
      const elems = document.querySelectorAll(selector);

      const mask = function (event) {
         const keyCode = event.keyCode;
         const template = masked,
            def = template.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, "");

         let i = 0,
            newValue = template.replace(/[_\d]/g, function (a) {
               return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
         i = newValue.indexOf("_");
         if (i !== -1) {
            newValue = newValue.slice(0, i);
         }
         let reg = template.substr(0, this.value.length).replace(/_+/g,
            function (a) {
               return "\\d{1," + a.length + "}";
            }).replace(/[+()]/g, "\\$&");
         reg = new RegExp("^" + reg + "$");
         if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
            this.value = newValue;
         }
         if (event.type === "blur" && this.value.length < 5) {
            this.value = "";
         }

      };

      for (const elem of elems) {
         elem.addEventListener("input", mask);
         elem.addEventListener("focus", mask);
         elem.addEventListener("blur", mask);
      }

   }

   maskPhone('#form1-phone');
   maskPhone('#form2-phone');
   maskPhone('#form3-phone');

   // --------------------------------------------------------------------------
   // const postData = (dataValues, outputData, errorData) => {
   //    const request = new XMLHttpRequest();
   //    request.addEventListener('readystatechange', () => {
   //       if (request.readyState !== 4) {
   //          return;
   //       }
   //       if (request.status === 200) {
   //          outputData();
   //       } else {
   //          errorData(request.status);
   //       }
   //    });

   //    request.open('POST', './server.php');
   //    request.setRequestHeader('Content-Type', 'application/json');
   //    request.send(JSON.stringify(dataValues));
   // };

   const postData = (dataValues) => {
      return new Promise((resolve, reject) => {
         const request = new XMLHttpRequest();
         request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) {
               return;
            }
            if (request.status === 200) {
               resolve();
            } else {
               reject(request.statusText);
            }
         });

         request.open('POST', './server.php');
         request.setRequestHeader('Content-Type', 'application/json');
         request.send(JSON.stringify(dataValues));
      });

   };

   document.addEventListener('submit', event => {
      event.preventDefault();
      let target = event.target;
      let formInputText = null, timeout = 5000;

      if (!(target.matches('#form1') || target.matches('#form2') || target.matches('#form3'))) {
         return;
      }

      if (target.matches('#form2')) {
         formInputText = document.getElementById('form2-message');
      }

      if (target.matches('#form3')) {
         timeout = 1000;
      }

      const formInputName = document.getElementById(`${target.id}-name`);
      const formInputEmail = document.getElementById(`${target.id}-email`);
      const formInputPhone = document.getElementById(`${target.id}-phone`);

      let statusMessage = target.querySelector('.js-status-message');

      if (!statusMessage) {
         statusMessage = document.createElement('div');
         statusMessage.classList.add('js-status-message');
         statusMessage.style.cssText = `color:white; font-size:12px;`;
         target.append(statusMessage);
      }

      const errorMessage = 'Что-то пошло не так ...';
      const loadMessage = 'Загрузка ...';
      const successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

      // Валидация полей
      // Имя
      if (formInputName.value.length < 2) {
         statusMessage.style.color = '#FFA6AE';
         statusMessage.textContent = 'Имя не может быть короче двух символов!';
         return;
      }

      // Почта
      if (formInputEmail.value.length === 0 ||
         !(/.+@.+\..+/i.test(formInputEmail.value))) {
         statusMessage.style.color = '#FFA6AE';
         statusMessage.textContent = 'Поле "E-mail" заполнено некорректно!';
         return;
      }

      // Сообщение
      if (target.matches('#form2')) {
         if (formInputText.value.length === 0) {
            statusMessage.style.color = '#FFA6AE';
            statusMessage.textContent = 'Поле "Сообщение" не заполнено!';
            return;
         }
      }

      let formDataValues = {};
      statusMessage.style.color = 'white';
      statusMessage.textContent = loadMessage;

      const formData = new FormData(target);
      formData.forEach((item, index) => {
         formDataValues[index] = item;
      });

      // postData(formDataValues,
      //    () => {
      //       statusMessage.textContent = successMessage;
      //       setTimeout(() => {
      //          statusMessage.textContent = '';
      //          statusMessage.remove();
      //          if (target.matches('#form3')) {
      //             document.querySelector('.popup').style.display = 'none';
      //          }
      //       }, timeout);
      //    },
      //    (error) => {
      //       statusMessage.textContent = `${errorMessage} (${error})`;
      //    }
      // );

      postData(formDataValues)
         .then(() => {
            statusMessage.textContent = successMessage;
            setTimeout(() => {
               statusMessage.textContent = '';
               statusMessage.remove();
               if (target.matches('#form3')) {
                  document.querySelector('.popup').style.display = 'none';
               }
            }, timeout);
         })
         .catch(error => statusMessage.textContent = `${errorMessage} (${error})`);

      // очистка инпутов
      formInputName.value = '';
      formInputEmail.value = '';
      formInputPhone.value = '';
      if (formInputText) {
         formInputText.value = '';
      }

   });

}); // Закрывашка DOMContentLoaded
